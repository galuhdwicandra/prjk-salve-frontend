/ponytail full

Mode: analysis and recommendations only. Do not apply any changes — I will
apply them myself. Do not run commands that write files or cache
(install, migration, build, format, test).
==========================================

Website:
salvecs.com <- primary
staging.salvecs.com <- testing
==============================

Project context:

* Explore the relevant files and symbols using Serena, including related callers,
  callees, imports, exports, and references. Read files in full only if symbol
  analysis is insufficient.
* Do not assume endpoints, fields, roles, tables, configurations, dependencies,
  or behavior that cannot be proven from the code. If the evidence cannot be found,
  state that explicitly — do not guess.
* Follow the existing project structure, naming conventions, error-handling patterns,
  validation patterns, and architecture.
* Use APIs and syntax compatible with the dependency versions actually installed
  in the project (check composer.json / package.json / lock files). Do not force
  the latest technology. If external knowledge beyond the project contents is needed,
  state what I need to verify in the official documentation.
* The project-pwa folder is a read-only archive of the CRAFT prototype. Read it only
  when I ask for a design or screen-behavior reference. Do not propose code changes
  there, do not include it in the implementation plan, and do not use its package.json
  as the basis for dependency decisions. The active implementation is in the
  frontend folder.
* Frontend_Docs.md and Backend_Docs.md do not need to be read.
* Clean Code is mandatory. Do not include any comments in the code.
* Carefully if want to use `any` in the code because it often causes errors.
* For every file that needs to be changed, Provide the code snippet that was changed, along with the code before the change so I don't get confused. use - or +
* Build the module if it is indeed not yet available, and build the page if it is not yet available.
* Do not include a test folder.
==============================
Response format:

1. Findings and root cause, with references such as path/file.php:42.
2. Recommended minimum solution.
3. For existing files: path, function/class/block name to be changed, and
   a patch/diff with sufficient context.
4. For genuinely necessary new files: full code.
5. What was intentionally not added, and when it would become appropriate to add it.
6. Verification commands that I can run myself — do not run them.
===================================
[STORY]

Master Kategori Transaksi – Mapping Akun

Perlu dilakukan pengecekan kembali terhadap kebutuhan mapping akun pada Master Kategori Transaksi.

Master Kategori Transaksi seharusnya berfungsi untuk menyederhanakan pengelompokan akun. Saat ini user masih diminta melakukan mapping akun kembali, sehingga proses tersebut terkesan dilakukan dua kali.

Perlu dipastikan apakah mapping akun pada Master Kategori Transaksi memang masih diperlukan atau dapat menggunakan mapping yang sudah tersedia sebelumnya agar tidak terjadi proses yang redundant.