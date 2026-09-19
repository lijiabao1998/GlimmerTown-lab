param([string]$Title = "TheoTown")
Add-Type @'
using System;using System.Text;using System.Runtime.InteropServices;
public class Win {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h,int x,int y,int w,int t,bool r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h,int c);
}
'@
$found = @()
$cb = [Win+EnumProc]{ param($h,$l)
  if ([Win]::IsWindowVisible($h)) {
    $sb = New-Object System.Text.StringBuilder 512
    [Win]::GetWindowText($h, $sb, 512) | Out-Null
    $t = $sb.ToString()
    if ($t -like "*$Title*") { $script:found += ,@($h, $t) }
  }
  return $true
}
[Win]::EnumWindows($cb, [IntPtr]::Zero) | Out-Null
if ($found.Count -eq 0) { Write-Output "not-found"; exit 1 }
foreach ($f in $found) {
  $h = $f[0]
  [Win]::ShowWindow($h, 3) | Out-Null          # maximize
  Start-Sleep -Milliseconds 400
  [Win]::MoveWindow($h, 0, 0, 1440, 900, $true) | Out-Null
  [Win]::SetForegroundWindow($h) | Out-Null
  Write-Output ("moved: " + $f[1])
}
