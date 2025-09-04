export const Routes = {
  SPLASH: "/",
  LOGIN: "/login",
  MENU: "/menu",
  IDENTITAS: "/identitas",
  ADMINISTRASI: "/administrasi",
  GENERATOR: "/generator",
  ADMINISTRASI_VIEW_CATEGORIES: "/administrasi_view_categories",
  LOCAL_RESULTS_BASE: "/local_results",
  MODUL: "/modul",
  PRESENSI: "/presensi",
  PENILAIAN: "/penilaian",
  JADWAL: "/jadwal",
  EDIT_JADWAL: "/edit_jadwal",
  LIHAT_JADWAL: "/lihat_jadwal",
  SISWA_LIST: "/siswa_list",
  SISWA_TAMBAH_KELAS: "/siswa_tambah_kelas",
  SISWA_DETAIL_PREFIX: "/siswa_detail",
  LAPORAN_KEPALA_SEKOLAH: "/laporan_kepala_sekolah",
  LAPORAN_PENGAWAS: "/laporan_pengawas",
};

// ====== builders (mirror Kotlin) ======
export const toLoginWithNext = (target) =>
  `/login?next=${encodeURIComponent(target)}`;

export const toLocalResults = (category) =>
  `${Routes.LOCAL_RESULTS_BASE}/${encodeURIComponent(category)}`;

export const toPresensiInputPertemuan = (kelas, materiPlain) =>
  `/presensi/input/${encodeURIComponent(kelas)}/${encodeURIComponent(materiPlain)}`;

export const toPresensiForm = (kelas, materiPlain, pertemuan) =>
  `/presensi/form/${encodeURIComponent(kelas)}/${encodeURIComponent(materiPlain)}/${pertemuan}`;

export const toPresensiRekap = (kelas) =>
  `/presensi/rekap/${encodeURIComponent(kelas)}`;

export const toPenilaianInputPertemuan = (kelas, materiPlain) =>
  `/penilaian/input/${encodeURIComponent(kelas)}/${encodeURIComponent(materiPlain)}`;

export const toPenilaianFormNilai = (kelas, materiPlain, pertemuan) =>
  `/penilaian/form/${encodeURIComponent(kelas)}/${encodeURIComponent(materiPlain)}/${pertemuan}`;

export const toPenilaianRekapLengkap = (kelas) =>
  `/penilaian/rekap/${encodeURIComponent(kelas)}`;

export const toSiswaDetail = (kelasPlain) =>
  `/siswa_detail/${encodeURIComponent(kelasPlain)}`;
