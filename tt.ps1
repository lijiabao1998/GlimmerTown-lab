# 對 TheoTown 做「聚焦 → 操作 → 截圖」一次完成（避免焦點被別的視窗搶走）
param([string]$Out, [int]$Wheel = 0, [int]$ClickX = -1, [int]$ClickY = -1, [int]$MoveX = 720, [int]$MoveY = 400, [int]$WaitMs = 1500)
Add-Type @'
using System;using System.Text;using System.Drawing;using System.Windows.Forms;using System.Runtime.InteropServices;
public class TT {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h,int x,int y,int w,int t,bool r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int t2, uint flags);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h,int c);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x,int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f,uint dx,uint dy,int d,IntPtr e);
  public static IntPtr Find(string title){
    IntPtr hit = IntPtr.Zero;
    EnumWindows((h,l)=>{ if(!IsWindowVisible(h)) return true; var sb=new StringBuilder(512); GetWindowText(h,sb,512);
      if(sb.ToString().Contains(title)){ hit=h; return false; } return true; }, IntPtr.Zero);
    return hit;
  }
  public static void Wheel(int x,int y,int t){ SetCursorPos(x,y); System.Threading.Thread.Sleep(180);
    for(int i=0;i<Math.Abs(t);i++){ mouse_event(0x0800,0,0,t>0?120:-120,IntPtr.Zero); System.Threading.Thread.Sleep(110);} }
  public static void Click(int x,int y){ SetCursorPos(x,y); System.Threading.Thread.Sleep(150);
    mouse_event(0x0002,0,0,0,IntPtr.Zero); System.Threading.Thread.Sleep(110); mouse_event(0x0004,0,0,0,IntPtr.Zero); }
  public static void Key(byte vk, byte scan, bool up){ keybd_event(vk, scan, up?(uint)2:0, IntPtr.Zero); }
  [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, IntPtr extra);
}
'@
$h = [TT]::Find("TheoTown")
if ($h -eq [IntPtr]::Zero) { Write-Output "not-found"; exit 1 }
[TT]::ShowWindow($h, 3) | Out-Null
[TT]::MoveWindow($h, 0, 0, 1440, 900, $true) | Out-Null
[TT]::SetForegroundWindow($h) | Out-Null
# ZCode 會鎖住前景，SetForegroundWindow 拉不上來 ⇒ 直接把 TheoTown 設為置頂（HWND_TOPMOST=-1）
[TT]::SetWindowPos($h, [IntPtr](-1), 0, 0, 1440, 900, 0x0040) | Out-Null
Start-Sleep -Milliseconds 1200
if ($Wheel -ne 0) { [TT]::Wheel($MoveX,$MoveY,$Wheel); Start-Sleep -Milliseconds 700 }
if ($ClickX -ge 0) { [TT]::Click($ClickX,$ClickY); Start-Sleep -Milliseconds 700 }
Start-Sleep -Milliseconds $WaitMs
$b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $b.Width, $b.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($b.Location, [System.Drawing.Point]::Empty, $b.Size)
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output ("OK " + $Out)
