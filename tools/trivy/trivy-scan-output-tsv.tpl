"Image"	"Severity"	"Vulnerability ID"	"Vendor ID"	"Package Class"	"Package Type"	"Package Name"	"Installed Version"	"Fixed Version"	"Severity Source"	"Primary Url"	"Title"
{{- range $ri, $r := . }}
{{- $imageName := $r.Target }}
{{- $pkgClass := $r.Class }}
{{- $pkgType := $r.Type }}
{{- range $vi, $v := .Vulnerabilities }}
"{{ $imageName }}"	"{{ $v.Severity }}"	"{{ $v.VulnerabilityID }}"	"{{ $v.VendorIDs | join ", " }}"	"{{ $pkgClass }}"	"{{ $pkgType }}"	"{{ $v.PkgName }}"	"{{ $v.InstalledVersion }}"	"{{ $v.FixedVersion }}"	"{{ $v.SeveritySource }}"	"{{$v.PrimaryURL}}"	"{{ $v.Title }}"
{{- end}}
{{- end }}