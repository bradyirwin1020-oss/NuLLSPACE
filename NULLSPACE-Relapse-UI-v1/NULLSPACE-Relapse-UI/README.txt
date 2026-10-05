NULLSPACE // RELAPSE UI
========================

What this is
------------
A drop-in visual/front-end replacement for the current Relapse exploit host.
It does NOT replace the exploit implementation. It keeps the same existing
Relapse script structure and only upgrades the UI plus log/status handling.

Files included
--------------
index.html
src/site.js

How to use
----------
1. Download/clone the current Relapse-Exploit repository.
2. Back up the original:
      index.html
      src/site.js
3. Copy these two NULLSPACE files over those two paths.
4. Leave every other Relapse file/folder untouched.
5. Host the folder the same way you normally host Relapse.

Desktop preview
---------------
Opening the page on a PC is useful for checking the layout, but the actual
Relapse runtime will correctly stop because the firmware script expects the
PlayStation 5 user agent.

Design behavior
---------------
- Detects and displays firmware.
- Uses real Relapse writeLog events.
- Tracks WebKit -> ROP worker -> kernel -> ELF loader.
- Shows the loader as ready when the runtime reports port 9021.
- Retry simply reloads the page rather than trying to run the chain twice.
- Clear only clears the visible console.

Important
---------
The included site.js is based on the public Relapse frontend interface shape
and is intended to be used with the rest of the original project tree.
Keep the original project's credits/license/disclaimer with any distribution.
Use only on hardware/software you own or are authorized to test.
