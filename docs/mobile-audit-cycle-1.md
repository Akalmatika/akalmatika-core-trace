# Mobile Audit Cycle 1

## Summary
- Total state/page checked: 9 routes * 7 viewports = 63 tests
- PASS: 58 (No horizontal overflow detected by strict script, but visual review is needed)
- WARN: -
- FAIL: 5 (All from `dev_schema` route)
- Critical issues remaining: `dev_schema` causes horizontal overflow on all mobile viewports (ScrollWidth: 574px on InnerWidth: 320-430px). Visual inspection of other routes is necessary.

## Results by State/Page

### dev_schema
- Viewports: All mobile (320x640, 360x740, 375x812, 390x844, 414x896, 430x932)
- Status: FAIL
- Screenshot path: `test-results/mobile-screenshots/dev_schema-Mobile-*.png`
- Masalah: Horizontal overflow
- Penyebab teknis: Belum ditelusuri.
- Risiko pedagogis: N/A (Fitur developer)
- File yang diubah: -
- Perbaikan: -
- Status setelah perbaikan: -

## Remaining Issues
Tulis jujur. Jangan klaim selesai jika belum.
- `dev_schema` mengalami horizontal overflow.
- Perlu verifikasi visual untuk teks yang kepotong atau elemen matematika yang *clipping* pada route `siswa` dan `sandbox`.
