param([int]$X, [int]$Y)
Add-Type @'
using System;using System.Runtime.InteropServices;
public class M {
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x,int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f,uint dx,uint dy,uint d,IntPtr e);
  public const uint LD=0x0002, LU=0x0004;
  public static void Click(int x,int y){ SetCursorPos(x,y); System.Threading.Thread.Sleep(120); mouse_event(LD,0,0,0,IntPtr.Zero); System.Threading.Thread.Sleep(90); mouse_event(LU,0,0,0,IntPtr.Zero); }
}
'@
[M]::Click($X,$Y); Write-Output "clicked $X,$Y"
