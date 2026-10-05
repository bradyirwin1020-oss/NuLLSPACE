# NULLSPACE / PS5

This is the supplied Relapse autoload site with a NULLSPACE visual interface: cyan/violet falling Matrix columns, matching home and payload screens, a themed full console, and a kernel-success message.

## Use
1. Extract the archive. Publish the CONTENTS of NULLSPACE to an HTTPS static web host, keeping all folders and filenames together. HTTPS is required by the existing verified payload sender. This download is site source, not an already hosted public URL.
2. Open your hosted index.html on the PS5 after a full restart.
3. Select RUN JAILBREAK and keep the page open. The initial autoload delay is 15 seconds; the supplied sequence retains its 15-second inter-payload pauses.
4. Follow the full console output. “Jailbreaked — kernel stage complete” only appears when the supplied runner reports kernel completion. It does not certify that every payload started.
5. After startup completes, use the Launch Payloads button below the console, or press Circle once to reach the live menu. That menu retains the active sender. Each manual send locks further launches for 15 seconds.

The landing page's Launch Payloads link opens the catalog and running-service links. To send optional payloads, use the live menu inside the completed startup page. Opening a new page cannot recreate its native session.

## Scope and verification
- Core src/, offsets/, and payloads/ files are unchanged from the supplied autoload archive. Original licenses, source credits, notices, release data, and Classic page are retained.
- Existing restart guard, checksum validation, service readiness checks, etaHEN loader repair, and browser-installer behavior are retained.
- The default supplied startup sequence includes Payload Manager, App Dumper, and a browser installation check. To skip the browser installer check, add &browser=0 to the run.html URL (or ?browser=0 if it has no query).
- The supplied sources mention a kernel stall under investigation. The visual update does not fix or validate that underlying issue.
- A 15-second wait is spacing, not a guarantee of stability or safety. Payload transfer does not prove native execution succeeded.
- Desktop checks cannot validate firmware compatibility, kernel exploitation, console rendering, or payload execution. PS5 hardware testing is still required.
- Matrix animation respects reduced-motion preferences and pauses drawing in hidden tabs. It adds rendering work and may affect exploit timing on console hardware.

Internal haze-prefixed filenames are deliberately retained for source compatibility and attribution. Do not rename individual files.
