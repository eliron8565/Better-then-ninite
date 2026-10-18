using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace AppForgeInstaller;

// A sidecar setup manifest does not modify the EXE and therefore preserves code signatures.
// Only known catalog entries are accepted; no arbitrary commands or package IDs are trusted.
internal sealed record ManifestSelectionResult(bool Found, bool Valid, IReadOnlyList<AppItem> Apps, string Error);

internal static class SelectionManifest
{
    private const string ManifestName = "appforge-setup.json";
    private const string ManifestFormat = "appforge-windows-manifest";
    private const long MaximumBytes = 64 * 1024;

    internal static ManifestSelectionResult Read(string executablePath, IReadOnlyList<AppItem> catalog)
    {
        var path = Path.Combine(Path.GetDirectoryName(executablePath)!, ManifestName);
        if (!File.Exists(path))
            return new(false, false, Array.Empty<AppItem>(), "");

        static ManifestSelectionResult Fail(string detail) =>
            new(true, false, Array.Empty<AppItem>(), "Invalid appforge-setup.json: " + detail);

        try
        {
            var info = new FileInfo(path);
            if (info.Length == 0 || info.Length > MaximumBytes)
                return Fail("file is empty or larger than 64 KB.");

            using var json = JsonDocument.Parse(File.ReadAllText(path));
            var root = json.RootElement;
            if (root.ValueKind != JsonValueKind.Object ||
                !root.TryGetProperty("format", out var format) ||
                format.ValueKind != JsonValueKind.String ||
                format.GetString() != ManifestFormat ||
                !root.TryGetProperty("schemaVersion", out var schema) ||
                schema.ValueKind != JsonValueKind.Number ||
                !schema.TryGetInt32(out var version) || version != 1)
                return Fail("unsupported format or version.");

            if (!root.TryGetProperty("exeSha256", out var hash) ||
                hash.ValueKind != JsonValueKind.String ||
                hash.GetString() is not string expected ||
                !Regex.IsMatch(expected, @"^[a-fA-F0-9]{64}$"))
                return Fail("a valid executable SHA-256 is required.");

            // Check the actual EXE before accepting a selection from its adjacent file.
            using (var stream = File.OpenRead(executablePath))
            {
                var digest = Convert.ToHexString(SHA256.HashData(stream));
                if (!digest.Equals(expected, StringComparison.OrdinalIgnoreCase))
                    return Fail("installer SHA-256 mismatch. Download a fresh ZIP and extract both files.");
            }

            if (!root.TryGetProperty("apps", out var choices) ||
                choices.ValueKind != JsonValueKind.Array ||
                choices.GetArrayLength() is < 1 or > 168)
                return Fail("apps must contain between 1 and 168 items.");

            var known = catalog.ToDictionary(a => a.Index);
            var seen = new HashSet<int>();
            var selected = new List<AppItem>();
            foreach (var entry in choices.EnumerateArray())
            {
                if (entry.ValueKind != JsonValueKind.Object ||
                    !entry.TryGetProperty("index", out var indexProp) ||
                    indexProp.ValueKind != JsonValueKind.Number ||
                    !indexProp.TryGetInt32(out var id) ||
                    !known.TryGetValue(id, out var app) ||
                    !seen.Add(id) ||
                    !entry.TryGetProperty("packageId", out var packageProp) ||
                    packageProp.ValueKind != JsonValueKind.String ||
                    packageProp.GetString() != app.PackageId ||
                    !entry.TryGetProperty("name", out var nameProp) ||
                    nameProp.ValueKind != JsonValueKind.String ||
                    nameProp.GetString() != app.Name)
                    return Fail("unknown, duplicated or mismatched app. Nothing was installed.");
                selected.Add(app);
            }
            return new(true, true, selected, "");
        }
        catch (Exception ex) when (ex is JsonException or IOException or UnauthorizedAccessException or ArgumentException or InvalidOperationException)
        {
            return Fail("unreadable or malformed setup file (" + ex.GetType().Name + ").");
        }
    }
}
