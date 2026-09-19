param([int]$X, [int]$Y, [int]$Ticks)
Add-Type @'
using System;using System.Runtime.InteropServices;
public class W2 {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x,int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f,uint dx,uint dy,int d,IntPtr e);
  public static void Wheel(int x,int y,int t){ SetCursorPos(x,y); System.Threading.Thread.Sleep(150);
    for(int i=0;i<Math.Abs(t);i++){ mouse_event(0x0800,0,0,t>0?120:-120,IntPtr.Zero); System.Threading.Thread.Sleep(90);} }
}
'@
[W2]::Wheel($X,$Y,$Ticks); Write-Output "wheel $Ticks at $X,$Y"
