
let trip = null;

async function loadTrip(){
  const res = await fetch("trip.json");
  trip = await res.json();
  renderFlights();
  renderStays();
  renderPlaces();
  renderPacking();
  renderContacts();
  if(trip.expenses) {
    document.getElementById("expenseLink").href = trip.expenses;
    document.querySelector("#expenses .small").style.display = "none";
  }
}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function mapButton(url,label="🗺️ Mở Google Maps"){return `<a class="secondary" href="${url}" target="_blank">${label}</a>`}
function renderFlights(){
  const g=trip.flights.group,n=trip.flights.nga;
  const card=(who,f,back=false)=>`<div class="card flight"><div class="who">${esc(who)}</div><h3>${esc(f.airline)} · ${esc(f.flight)}</h3><div class="route"><div class="airport"><strong>${esc(f.from.split(" ")[0])}</strong><span>${esc(f.from)}</span><small>${esc(f.depart)}</small></div><div class="arrow">→<br><small>${esc(f.date)}</small></div><div class="airport"><strong>${esc(f.to.split(" ")[0])}</strong><span>${esc(f.to)}</span><small>${esc(f.arrive)}</small></div></div><div class="flight-meta"><span class="pill">🎫 ${esc(f.booking)}</span>${f.duration?`<span class="pill">⏱ ${esc(f.duration)}</span>`:""}<span class="pill">${back?"Về Việt Nam":"Đi Thái Lan"}</span></div>${f.note?`<p class="small">${esc(f.note)}</p>`:""}</div>`;
  document.getElementById("flightCards").innerHTML =
    card("👨‍👩‍👧‍👦 Nhóm 5 người · Đi",g.outbound)+card("👨‍👩‍👧‍👦 Nhóm 5 người · Về",g.return,true)+
    card("👩 Nga · Đi",n.outbound)+card("👩 Nga · Về",n.return,true);
}
function renderStays(){
  const a=trip.airbnbs;

  document.getElementById("stayCards").innerHTML=[a.bangkok,a.huaHin].map(x=>`
    <div class="card stay-card">
      <h3>📍 ${esc(x.name)}</h3>

      <div class="address">${esc(x.address)}</div>

      <div class="address" style="white-space:pre-line;margin-top:12px">
        ${esc(x.features || "")}
      </div>

      <div class="two">
        <a class="primary" href="${x.airbnb}" target="_blank">🏠 Mở Airbnb</a>
        <a class="secondary" href="${x.maps}" target="_blank">🗺️ Google Maps</a>
      </div>
    </div>
  `).join("");
}
}
function renderPlaces(){
  let html="";
  for(const [city,places] of Object.entries(trip.places)){
    html += `<div class="card"><h3>${city==="bangkok"?"🏙️ Bangkok":"🏖️ Hua Hin"}</h3>`;
    places.forEach((p,i)=>html+=`<div class="place" style="padding:12px 0;${i<places.length-1?"border-bottom:1px solid var(--line)":""}"><div class="info"><strong>${esc(p.name)}</strong><div class="small">${esc(p.address)}</div></div><a class="secondary" href="${p.maps}" target="_blank">📍 Maps</a></div>`);
    html+="</div>";
  }
  document.getElementById("placeCards").innerHTML=html;
}
const packing={
"👕 Quần áo":["5–6 áo nhẹ (hoặc ít hơn nếu giặt đồ ở Hua Hin)","4–5 quần short/quần nhẹ","1 bộ đẹp hơn để ăn tối","5–6 bộ đồ lót / tất","Đồ ngủ","Đồ bơi","Áo mưa/poncho nhẹ","Giày đi bộ thoải mái","Dép xỏ ngón"],
"☀️ Mưa + nắng nóng":["Ô nhỏ gọn","Mũ/nón","Kính râm","Kem chống nắng","Thuốc/xịt chống muỗi","Khăn nhỏ/khăn ướt"],
"👧 Cho trẻ em":["Bộ quần áo dự phòng trong túi ngày","Đồ bơi","Mũ","Ô nhỏ/poncho","Bình nước","Đồ chơi/giải trí nhỏ khi di chuyển","Thuốc cần thiết"],
"🔌 Điện tử":["Điện thoại","Sạc","Pin dự phòng","Cáp sạc","Đầu chuyển ổ cắm nếu cần","Tai nghe"],
"📄 Giấy tờ":["Hộ chiếu","Bản sao/ảnh hộ chiếu"],
"💳 Tiền":["Thẻ tín dụng/ghi nợ","Thẻ hoặc tiền mặt dự phòng cất riêng"]
};
function renderPacking(){
  document.getElementById("packingList").innerHTML=Object.entries(packing).map(([cat,items])=>`<div class="card"><h3>${cat}</h3>${items.map((x,i)=>`<label style="display:block;padding:7px 0"><input type="checkbox" data-pack="${cat}-${i}"> ${esc(x)}</label>`).join("")}</div>`).join("")+
  `<div class="card"><strong>🔌 Điện ở Thái Lan:</strong> 220V / 50Hz. Nhiều ổ cắm có thể dùng với các loại phích phổ biến; đa số thiết bị Việt Nam sẽ dùng được mà không cần bộ đổi điện áp.</div>`;
  document.querySelectorAll("[data-pack]").forEach(c=>{c.checked=localStorage.getItem(c.dataset.pack)==="1";c.onchange=()=>localStorage.setItem(c.dataset.pack,c.checked?"1":"0")});
}
function renderContacts(){
  const map={reneLink:"Rene",chrisLink:"Chris",bachLink:"Bách",moonLink:"Moon"};
  for(const [id,key] of Object.entries(map)){
    const num=trip.contacts[key];
    const el=document.getElementById(id);
    if(num){el.textContent=num;el.href="tel:"+num.replace(/\s/g,"");} else {el.textContent="Chưa thêm số";el.href="#emergency";}
  }
}
function copyAccount(){navigator.clipboard?.writeText(trip.money.account).then(()=>alert("Đã sao chép số tài khoản."));}
function scrollToId(id){if(id==="top")window.scrollTo({top:0,behavior:"smooth"});else document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});}
function countdown(){
  const target=new Date("2026-08-28T10:55:00+07:00").getTime(), now=Date.now(), diff=target-now;
  const el=document.getElementById("countdown");
  if(diff<=0){el.textContent="Chuyến đi đã bắt đầu! 🇹🇭";return}
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000);
  el.textContent=`${d} ngày ${h} giờ ${m} phút`;
}
loadTrip().catch(e=>console.error(e)); countdown(); setInterval(countdown,60000);
if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
