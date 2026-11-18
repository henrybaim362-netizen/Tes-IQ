var BANK=[
{q:"Lanjutkan pola: 2, 4, 8, 16, ...",o:["24","30","32","36"],a:2},
{q:"Lanjutkan pola: 3, 6, 11, 18, 27, ...",o:["36","38","40","42"],a:1},
{q:"Lanjutkan pola: 1, 1, 2, 3, 5, 8, ...",o:["11","12","13","14"],a:2},
{q:"Panas : Dingin = Siang : ...",o:["Pagi","Malam","Sore","Senja"],a:1},
{q:"Buku : Membaca = Pisau : ...",o:["Tajam","Memotong","Dapur","Besi"],a:1},
{q:"Semua kucing adalah hewan. Tom adalah kucing. Maka...",o:["Tom bukan hewan","Tom adalah hewan","Semua hewan adalah kucing","Tidak dapat disimpulkan"],a:1},
{q:"Mana yang berbeda dari yang lain?",o:["Apel","Jeruk","Wortel","Mangga"],a:2},
{q:"Jika 5 mesin membuat 5 produk dalam 5 menit, berapa menit yang dibutuhkan 100 mesin untuk membuat 100 produk?",o:["100","50","20","5"],a:3},
{q:"Ani lebih tinggi dari Budi. Budi lebih tinggi dari Cici. Siapa yang paling tinggi?",o:["Ani","Budi","Cici","Tidak dapat diketahui"],a:0},
{q:"Lanjutkan pola: 2, 6, 12, 20, 30, ...",o:["40","42","44","48"],a:1},
{q:"Lanjutkan pola huruf: A, C, F, J, O, ...",o:["S","T","U","V"],a:2},
{q:"Pada pukul 03.15, berapa derajat sudut antara jarum jam dan jarum menit?",o:["0","7,5","15","30"],a:1},
{q:"Usia ayah 4 kali usia anaknya. Lima tahun lagi usia ayah menjadi 3 kali usia anak. Berapa usia anak sekarang?",o:["5","8","10","12"],a:2},
{q:"Lanjutkan pola: 81, 27, 9, 3, ...",o:["0","1","2","6"],a:1},
{q:"Lanjutkan pola: 4, 9, 16, 25, ...",o:["30","34","36","49"],a:2}
];
var LIMIT=15*60, qs=[], ans=[], cur=0, left=LIMIT, tick=null;
function $(id){return document.getElementById(id)}
function show(id){["intro","quiz","result"].forEach(function(s){$(s).classList.toggle("hidden",s!==id)});window.scrollTo(0,0)}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function fmt(s){var m=Math.floor(s/60),r=s%60;return (m<10?"0":"")+m+":"+(r<10?"0":"")+r}
function start(){
  qs=shuffle(BANK.slice()).map(function(x){
    var opts=x.o.map(function(t,i){return {t:t,ok:i===x.a}});
    return {q:x.q,o:shuffle(opts)};
  });
  ans=qs.map(function(){return -1});
  cur=0;left=LIMIT;
  $("timer").textContent=fmt(left);
  clearInterval(tick);
  tick=setInterval(function(){
    left--;
    $("timer").textContent=fmt(left);
    $("timer").classList.toggle("low",left<=60);
    if(left<=0)finish();
  },1000);
  show("quiz");render();
}
function render(){
  var q=qs[cur],L=["A","B","C","D"];
  $("counter").textContent="Soal "+(cur+1)+" dari "+qs.length;
  $("prog").style.width=((cur+1)/qs.length*100)+"%";
  $("q").textContent=q.q;
  var box=$("opts");box.innerHTML="";
  q.o.forEach(function(o,i){
    var b=document.createElement("button");
    b.className="opt"+(ans[cur]===i?" sel":"");
    var l=document.createElement("b");l.textContent=L[i];
    var s=document.createElement("span");s.textContent=o.t;
    b.appendChild(l);b.appendChild(s);
    b.onclick=function(){ans[cur]=i;render()};
    box.appendChild(b);
  });
  $("prev").disabled=cur===0;
  var last=cur===qs.length-1;
  $("next").textContent=last?"Selesai":"Berikutnya";
  $("next").disabled=ans[cur]<0;
}
function finish(){
  clearInterval(tick);
  var n=0;
  qs.forEach(function(q,i){if(ans[i]>=0&&q.o[ans[i]].ok)n++});
  var iq=Math.round(100+(n-8)/3.2*15);
  iq=Math.max(70,Math.min(145,iq));
  var cat=iq>=130?"Sangat tinggi":iq>=115?"Di atas rata-rata":iq>=90?"Rata-rata":iq>=80?"Di bawah rata-rata":"Perlu latihan lagi";
  $("iq").textContent=iq;
  $("cat").textContent=cat;
  $("right").textContent=n+" dari "+qs.length;
  $("used").textContent=fmt(LIMIT-Math.max(left,0));
  $("pin").style.left=((iq-70)/75*100)+"%";
  show("result");
}
$("start").onclick=start;
$("again").onclick=function(){show("intro")};
$("prev").onclick=function(){if(cur>0){cur--;render()}};
$("next").onclick=function(){if(cur<qs.length-1){cur++;render()}else finish()};
