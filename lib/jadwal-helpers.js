// List hari + generator jam pelajaran (07.05 dengan blok 35 menit x 12)
export const HARI_LIST = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

export function generateJamPelajaran() {
  const list = [];
  let hour = 7, minute = 5;
  for (let i = 1; i <= 12; i++) {
    const sH = hour, sM = minute;
    minute += 35;
    if (minute >= 60) { hour += 1; minute -= 60; }
    const eH = hour, eM = minute;
    const waktu = `${pad2(sH)}.${pad2(sM)}-${pad2(eH)}.${pad2(eM)}`;
    list.push({ jamKe: i, waktu });
  }
  return list;
}
function pad2(n){ return String(n).padStart(2,"0"); }
