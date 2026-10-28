const clean=s=>String(s||"").replace(/[\u0000-\u001f\u007f]/g,"").trim();
const BLOCK=/\b(ganja|cannabis|marijuana|mdma|lsd|cocaine|heroin|opium|brown sugar|escort|call girl|matka|satta|betting|casino|fake (certificate|degree|marksheet|licen[cs]e)|firearm|pistol|ammunition|hawala)\b/i;
const CATS={
 "Mechanics & Repair":["Vehicle types handled","Brands you specialise in","Typical service price","Pickup / drop available","Warranty on work"],
 "Gyms & Fitness":["Monthly fee","Trainers and experience","Women-only batch","Facilities available","Free trial days"],
 "Training & Courses":["Courses offered","Course fees","Batch timings","Online / offline","Certificate / placement support"],
 "Tuition & Coaching":["Subjects and classes","Board (State / CBSE)","Medium (Tamil / Malayalam / English)","Monthly fee","Batch size"],
 "Salon & Beauty":["Services and price list","Men / Women / Unisex","Appointment needed","Home service"],
 "Food & Catering":["Cuisine / speciality","Price range per person","Home delivery","Bulk / event orders"],
 "Electronics & Tech":["Products / repairs","Brands handled","Warranty","Home service"],
 "Ayurveda & Wellness":["Treatments offered","Doctor qualification","Consultation fee","Appointment needed"],
 "Health & Pharmacy":["Services / specialities","Doctor qualification","Consultation fee","Open 24 hours"],
 "Home Services":["Services (plumbing, wiring, painting...)","Visiting charge","Emergency / same-day","Areas covered"],
 "Grocery & Daily Needs":["Products","Home delivery","Minimum order","Payment options (UPI / cash)"],
 "Textiles & Fashion":["Products (sarees, kids, uniforms...)","Price range","Bulk / wholesale","Stitching / alteration"],
 "Jewellery":["Gold purity and hallmark","Making charges","Old gold exchange","Savings schemes (legally registered only)"],
 "Stay & Tourism":["Room types","Price per night","Facilities","Check-in / check-out time"],
 "Travel & Rentals":["Vehicle types","Rate per km / per day","Driver languages","Advance booking needed"],
 "Events & Photography":["Services","Package price","Areas covered","Advance booking needed"],
 "Agriculture & Farm":["Products (seeds, tools, equipment...)","Delivery","Advisory support","Payment options"],
 "Professional Services":["Service type","Consultation fee","Languages","Appointment needed"],
 "Other":["Key products / services","Price range","Delivery available"]};
const LIC={
 "Food & Catering":{l:"FSSAI licence / registration no.",r:true},
 "Health & Pharmacy":{l:"Drug licence / clinic registration no.",r:true},
 "Ayurveda & Wellness":{l:"Practitioner / clinic registration no.",r:true},
 "Agriculture & Farm":{l:"Seed / fertiliser / pesticide dealer licence no.",r:true},
 "Professional Services":{l:"Professional registration / membership no.",r:true},
 "Jewellery":{l:"BIS hallmarking / jeweller registration no.",r:false},
 "Stay & Tourism":{l:"Tourism department / trade licence no.",r:false},
 "Travel & Rentals":{l:"Permit / registration no.",r:false}};
const CN={ta:["இயந்திர பழுது பார்ப்பு","உடற்பயிற்சி நிலையங்கள்","பயிற்சி & படிப்புகள்","டியூஷன் & பயிற்சி வகுப்பு","சலூன் & அழகு","உணவு & கேட்டரிங்","எலக்ட்ரானிக்ஸ் & தொழில்நுட்பம்","ஆயுர்வேதம் & நலன்","மருத்துவம் & மருந்தகம்","வீட்டுச் சேவைகள்","மளிகை & அன்றாடத் தேவைகள்","ஜவுளி & ஃபேஷன்","நகைகள்","தங்குமிடம் & சுற்றுலா","பயணம் & வாடகை வாகனங்கள்","நிகழ்ச்சிகள் & புகைப்படம்","விவசாயம் & இடுபொருட்கள்","தொழில்முறை சேவைகள்","மற்றவை"],
 ml:["മെക്കാനിക്ക് & റിപ്പയർ","ജിം & ഫിറ്റ്നസ്","പരിശീലനം & കോഴ്സുകൾ","ട്യൂഷൻ & കോച്ചിംഗ്","സലൂൺ & ബ്യൂട്ടി","ഭക്ഷണം & കാറ്ററിംഗ്","ഇലക്ട്രോണിക്സ് & ടെക്","ആയുർവേദം & ആരോഗ്യം","ആരോഗ്യം & ഫാർമസി","ഹോം സർവീസ്","പലചരക്ക് & നിത്യോപയോഗം","ടെക്സ്റ്റൈൽസ് & ഫാഷൻ","ആഭരണങ്ങൾ","താമസം & ടൂറിസം","യാത്ര & വാടക വാഹനങ്ങൾ","ഇവന്റുകൾ & ഫോട്ടോഗ്രാഫി","കൃഷി & ഉപകരണങ്ങൾ","പ്രൊഫഷണൽ സേവനങ്ങൾ","മറ്റുള്ളവ"]};
const D={"Tamil Nadu":"Ariyalur,Chengalpattu,Chennai,Coimbatore,Cuddalore,Dharmapuri,Dindigul,Erode,Kallakurichi,Kancheepuram,Kanniyakumari,Karur,Krishnagiri,Madurai,Mayiladuthurai,Nagapattinam,Namakkal,Nilgiris,Perambalur,Pudukkottai,Ramanathapuram,Ranipet,Salem,Sivaganga,Tenkasi,Thanjavur,Theni,Thoothukudi,Tiruchirappalli,Tirunelveli,Tirupathur,Tiruppur,Tiruvallur,Tiruvannamalai,Tiruvarur,Vellore,Viluppuram,Virudhunagar".split(","),
 "Kerala":"Alappuzha,Ernakulam,Idukki,Kannur,Kasaragod,Kollam,Kottayam,Kozhikode,Malappuram,Palakkad,Pathanamthitta,Thiruvananthapuram,Thrissur,Wayanad".split(",")};
const SN={ta:{"Tamil Nadu":"தமிழ்நாடு","Kerala":"கேரளா"},ml:{"Tamil Nadu":"തമിഴ്നാട്","Kerala":"കേരളം"}};
const T={
en:{edit:"Edit",rep:"Report",signout:"Sign out",ver:"Verified by Nalvo",pend:"Pending review",near:"Near me",locBtn:"Use my current location",dir:"Directions",km:"km",locOk:"Location saved",locErr:"Could not get your location. Please allow location access.",h1:"Find trusted local businesses, with real details.",p:"Mechanics, gyms, training centres, tuition and more across Tamil Nadu and Kerala. Photos, services, fees and timings, shared by the owners themselves.",add:"List your business",q:"Search: bike service, women trainer, Python course",allSt:"All states",allDist:"All districts",all:"All",found:n=>n+(n==1?" business found":" businesses found"),none:"No businesses listed yet.",noneQ:"Nothing matches your search.",noneSub:"Own a business? Be the first to list it.",call:"Call",wa:"WhatsApp",map:"Map",del:"Delete",formT:"List your business",formS:"Free. The more detail you give, the more customers you reach.",f_name:"Business name *",f_cat:"Category *",f_ph:"Phone / WhatsApp *",f_state:"State *",f_dist:"District *",f_area:"Locality / town *",f_time:"Timings",f_addr:"Full address",f_map:"Google Maps link (optional)",f_desc:"About your business",f_tags:"Services / specialities (comma separated)",f_img:"Photo of your shop (optional)",pub:"Publish listing",cancel:"Cancel",det:"Details customers look for",tm:"Timings",ad:"Address"},
ta:{edit:"திருத்து",rep:"புகார்",signout:"வெளியேறு",ver:"நல்வோ சரிபார்த்தது",pend:"ஆய்வில் உள்ளது",near:"என் அருகில்",locBtn:"என் தற்போதைய இடத்தைப் பயன்படுத்து",dir:"வழி",km:"கி.மீ",locOk:"இடம் சேமிக்கப்பட்டது",locErr:"உங்கள் இடத்தை பெற முடியவில்லை. இருப்பிட அனுமதியை வழங்கவும்.",h1:"நம்பகமான உள்ளூர் தொழில்களை, உண்மையான விவரங்களுடன் கண்டறியுங்கள்.",p:"தமிழ்நாடு மற்றும் கேரளா முழுவதும் மெக்கானிக், ஜிம், பயிற்சி மையங்கள், டியூஷன் மற்றும் பல. புகைப்படம், சேவைகள், கட்டணம், நேரம் - உரிமையாளர்களே பகிர்ந்தவை.",add:"தொழிலைப் பதிவு செய்க",q:"தேடுக: பைக் சர்வீஸ், பெண் பயிற்சியாளர், பைதான் வகுப்பு",allSt:"அனைத்து மாநிலங்கள்",allDist:"அனைத்து மாவட்டங்கள்",all:"அனைத்தும்",found:n=>n+" தொழில்கள் கிடைத்தன",none:"இன்னும் எந்த தொழிலும் பதிவு செய்யப்படவில்லை.",noneQ:"தேடலுக்கு பொருத்தமானவை இல்லை.",noneSub:"உங்களிடம் தொழில் உள்ளதா? முதலில் பதிவு செய்யுங்கள்.",call:"அழைக்க",wa:"வாட்ஸ்அப்",map:"வரைபடம்",del:"நீக்கு",formT:"உங்கள் தொழிலைப் பதிவு செய்யுங்கள்",formS:"இலவசம். எவ்வளவு விவரம் தருகிறீர்களோ, அவ்வளவு வாடிக்கையாளர்கள் வருவார்கள்.",f_name:"தொழில் பெயர் *",f_cat:"வகை *",f_ph:"தொலைபேசி / வாட்ஸ்அப் *",f_state:"மாநிலம் *",f_dist:"மாவட்டம் *",f_area:"பகுதி / ஊர் *",f_time:"நேரம்",f_addr:"முழு முகவரி",f_map:"கூகுள் மேப் இணைப்பு (விருப்பம்)",f_desc:"உங்கள் தொழில் பற்றி",f_tags:"சேவைகள் / சிறப்புகள் (கமாவால் பிரிக்கவும்)",f_img:"கடையின் புகைப்படம் (விருப்பம்)",pub:"பதிவிடு",cancel:"ரத்து",det:"வாடிக்கையாளர்கள் தேடும் விவரங்கள்",tm:"நேரம்",ad:"முகவரி"},
ml:{edit:"എഡിറ്റ്",rep:"റിപ്പോർട്ട്",signout:"സൈൻ ഔട്ട്",ver:"നൽവോ പരിശോധിച്ചത്",pend:"പരിശോധനയിൽ",near:"എന്റെ അടുത്ത്",locBtn:"എന്റെ നിലവിലെ സ്ഥലം ഉപയോഗിക്കുക",dir:"വഴി",km:"കി.മീ",locOk:"സ്ഥലം സേവ് ചെയ്തു",locErr:"നിങ്ങളുടെ സ്ഥലം ലഭ്യമായില്ല. ലൊക്കേഷൻ അനുമതി നൽകുക.",h1:"വിശ്വസ്തരായ പ്രാദേശിക സ്ഥാപനങ്ങളെ, യഥാർത്ഥ വിവരങ്ങളോടെ കണ്ടെത്തൂ.",p:"തമിഴ്നാട്ടിലും കേരളത്തിലുമായി മെക്കാനിക്ക്, ജിം, ട്രെയിനിംഗ് സെന്റർ, ട്യൂഷൻ എന്നിവയും മറ്റും. ഫോട്ടോ, സേവനങ്ങൾ, നിരക്ക്, സമയം - ഉടമകൾ തന്നെ നൽകിയത്.",add:"സ്ഥാപനം ചേർക്കുക",q:"തിരയുക: ബൈക്ക് സർവീസ്, വനിതാ ട്രെയിനർ, പൈത്തൺ കോഴ്സ്",allSt:"എല്ലാ സംസ്ഥാനങ്ങളും",allDist:"എല്ലാ ജില്ലകളും",all:"എല്ലാം",found:n=>n+" സ്ഥാപനങ്ങൾ കണ്ടെത്തി",none:"ഇതുവരെ സ്ഥാപനങ്ങളൊന്നും ചേർത്തിട്ടില്ല.",noneQ:"തിരച്ചിലിന് അനുയോജ്യമായവ ഇല്ല.",noneSub:"നിങ്ങൾക്ക് സ്ഥാപനമുണ്ടോ? ആദ്യം ചേർക്കൂ.",call:"വിളിക്കുക",wa:"വാട്സ്ആപ്പ്",map:"മാപ്പ്",del:"ഇല്ലാതാക്കുക",formT:"നിങ്ങളുടെ സ്ഥാപനം ചേർക്കുക",formS:"സൗജന്യം. കൂടുതൽ വിവരങ്ങൾ നൽകിയാൽ കൂടുതൽ ഉപഭോക്താക്കൾ.",f_name:"സ്ഥാപനത്തിന്റെ പേര് *",f_cat:"വിഭാഗം *",f_ph:"ഫോൺ / വാട്സ്ആപ്പ് *",f_state:"സംസ്ഥാനം *",f_dist:"ജില്ല *",f_area:"സ്ഥലം / പ്രദേശം *",f_time:"സമയം",f_addr:"പൂർണ്ണ വിലാസം",f_map:"ഗൂഗിൾ മാപ്പ് ലിങ്ക് (ഓപ്ഷണൽ)",f_desc:"നിങ്ങളുടെ സ്ഥാപനത്തെക്കുറിച്ച്",f_tags:"സേവനങ്ങൾ / പ്രത്യേകതകൾ (കോമ ഉപയോഗിച്ച് വേർതിരിക്കുക)",f_img:"കടയുടെ ഫോട്ടോ (ഓപ്ഷണൽ)",pub:"പ്രസിദ്ധീകരിക്കുക",cancel:"റദ്ദാക്കുക",det:"ഉപഭോക്താക്കൾ തിരയുന്ന വിവരങ്ങൾ",tm:"സമയം",ad:"വിലാസം"}};
const $=id=>document.getElementById(id);
const CK=Object.keys(CATS);
let loaded=false,vonly=false,seen=new Set(),trackFn=null,editId=null,lastSub=0,repId=null,pos=null,fpos=null,lang="en",items=[],cat="",db=null,uid=null,canEdit=false;
try{lang=localStorage.getItem("nl")||"en"}catch(e){}
const t=k=>(T[lang]&&T[lang][k]!==undefined?T[lang][k]:T.en[k]);
const cname=c=>lang==="en"?c:CN[lang][CK.indexOf(c)];
const sname=s=>lang==="en"?s:SN[lang][s];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function note(m){const n=$("note");n.textContent=m;n.style.display=m?"block":"none"}

function fillSel(sel,vals,first,keep){
 const cur=keep?sel.value:"";
 sel.innerHTML=(first?`<option value="">${esc(first)}</option>`:"")+vals.map(v=>`<option value="${esc(v[0])}">${esc(v[1])}</option>`).join("");
 if(cur&&vals.some(v=>v[0]===cur))sel.value=cur;
}
function drawFilters(){
 fillSel($("state"),Object.keys(D).map(s=>[s,sname(s)]),t("allSt"),true);
 drawDist();
}
function drawDist(){
 const s=$("state").value;
 const ds=s?D[s]:[...new Set(items.map(i=>i.dist).filter(Boolean))].sort();
 fillSel($("dist"),ds.map(d=>[d,d]),t("allDist"),true);
}
const IC={"":'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
"Mechanics & Repair":'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
"Gyms & Fitness":'<path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/>',
"Training & Courses":'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
"Tuition & Coaching":'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
"Salon & Beauty":'<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5L20 19M8.5 15.5L20 5"/>',
"Food & Catering":'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
"Electronics & Tech":'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
"Ayurveda & Wellness":'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
"Health & Pharmacy":'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
"Home Services":'<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
"Grocery & Daily Needs":'<path d="M3 9h18l-2 11H5zM8 9l3-5M16 9l-3-5"/>',
"Textiles & Fashion":'<path d="M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>',
"Jewellery":'<path d="M6 4h12l4 6-10 11L2 10zM2 10h20M9 4l-2 6 5 11M15 4l2 6-5 11"/>',
"Stay & Tourism":'<path d="M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="2"/>',
"Travel & Rentals":'<path d="M5 16l1.5-6h11L19 16M3 16h18v3H3zM7 19v2M17 19v2"/>',
"Events & Photography":'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
"Agriculture & Farm":'<path d="M12 21v-9M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 14c0-3 2-5 6-5 0 3-2 5-6 5z"/>',
"Professional Services":'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',
"Other":'<path d="M3 9l1-5h16l1 5M4 9v11h16V9M9 20v-6h6v6"/>'};
const PIN='<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
function drawChips(){
 const all=[["",t("all")],...CK.map(c=>[c,cname(c)])];
 $("chips").innerHTML=all.map(c=>`<button class="tile ${c[0]===cat?"on":""}" data-c="${esc(c[0])}"><div class="ic"><svg viewBox="0 0 24 24">${IC[c[0]]}</svg></div><span>${esc(c[1])}</span></button>`).join("");
 $("chips").querySelectorAll(".tile").forEach(b=>b.onclick=()=>{cat=b.dataset.c;drawChips();render()});
}
function applyLang(){
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-i]").forEach(e=>e.textContent=t(e.dataset.i));
 document.querySelectorAll("[data-ip]").forEach(e=>e.placeholder=t(e.dataset.ip));
 document.querySelectorAll("#lang button").forEach(b=>b.classList.toggle("on",b.dataset.l===lang));
 fillSel($("f_cat"),CK.map(c=>[c,cname(c)]));
 fillSel($("f_state"),Object.keys(D).map(s=>[s,sname(s)]));drawFormDist();drawXtra();
 drawFilters();drawChips();render();
}
document.querySelectorAll("#lang button").forEach(b=>b.onclick=()=>{lang=b.dataset.l;try{localStorage.setItem("nl",lang)}catch(e){}applyLang()});

const hav=(a,b,c,d)=>{const r=Math.PI/180,x=Math.sin((c-a)*r/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin((d-b)*r/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const fe=i=>!!(i.featured_until&&Date.parse(i.featured_until)>Date.now());
function track(id,k){
 if(!trackFn)return;
 const it=items.find(x=>x.id===id);if(!it||(uid&&it.owner===uid))return;
 if(k==="view"){if(seen.has(id))return;seen.add(id)}
 trackFn(id,k);
}
function shareShop(id){
 const it=items.find(x=>x.id===id);if(!it)return;
 const url=location.origin+location.pathname+"#shop="+id,txt=it.name+" - "+it.area+", "+it.dist+" (Nalvo)";
 if(navigator.share){navigator.share({title:it.name,text:txt,url}).catch(()=>{})}
 else window.open("https://wa.me/?text="+encodeURIComponent(txt+" "+url),"_blank","noopener");
}
function gotoHash(){
 const m=/^#shop=([\w-]+)$/.exec(location.hash);if(!m)return;
 const el=document.getElementById("s-"+m[1]);if(!el)return;
 el.scrollIntoView({behavior:"smooth",block:"center"});el.classList.add("hl");
}
window.addEventListener("hashchange",gotoHash);
$("grid").addEventListener("click",e=>{const a=e.target.closest("[data-t]");if(a)track(a.dataset.sid,a.dataset.t)});
const dk=i=>(pos&&i.lat!=null&&i.lng!=null)?hav(pos.lat,pos.lng,i.lat,i.lng):1e9;
const dtxt=i=>dk(i)<1e8?`<span class="dd">${dk(i).toFixed(1)} ${t("km")}</span>`:"";
const dir=i=>/^https:\/\//.test(i.map||"")?i.map:"https://www.google.com/maps/dir/?api=1&destination="+(i.lat!=null&&i.lng!=null?i.lat+","+i.lng:encodeURIComponent([i.name,i.addr,i.area,i.dist,i.state].filter(Boolean).join(", ")));
function render(){
 if(!loaded){$("grid").innerHTML=Array(6).fill('<div class="card sk"><div class="ph"></div><div class="cb"><i></i><i></i><i></i></div></div>').join("");$("count").textContent="";return}
 const q=$("q").value.toLowerCase().trim(),s=$("state").value,d=$("dist").value;
 const list=items.filter(i=>(!cat||i.cat===cat)&&(!s||i.state===s)&&(!d||i.dist===d)&&(!q||JSON.stringify(i).toLowerCase().includes(q)));
 if(vonly)for(let k=list.length;k--;)if(!list[k].verified)list.splice(k,1);
 if(pos)list.sort((a,b)=>dk(a)-dk(b));else list.sort((a,b)=>(fe(b)-fe(a))||((b.verified?1:0)-(a.verified?1:0))||((b.created||0)-(a.created||0)));
 $("count").textContent=t("found")(list.length);
 $("hst").textContent=items.length?items.length+(items.length==1?" business":" businesses")+" in "+new Set(items.map(x=>x.dist)).size+(new Set(items.map(x=>x.dist)).size==1?" district":" districts"):"";
 if(!list.length){$("grid").innerHTML=`<div class="empty"><b>${t(items.length?"noneQ":"none")}</b>${t("noneSub")}</div>`;return}
 $("grid").innerHTML=list.map(i=>{
  const ph=String(i.ph||"").replace(/\D/g,"").slice(-10);
  const tags=(i.tags||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join("");
  const ex=Object.entries(i.extra||{}).filter(e=>e[1]).map(e=>`<dt>${esc(e[0])}</dt><dd>${esc(e[1])}</dd>`).join("");
  const mine=(uid&&i.owner===uid)||canEdit;
  const map=/^https:\/\//.test(i.map||"")?`<a href="${esc(i.map)}" target="_blank" rel="noopener">${t("map")}</a>`:"";
  return `<article class="card${fe(i)?" fea":""}" id="s-${esc(i.id)}"><div class="ph" style="${i.img?`background-image:url('${esc(i.img)}')`:""}">${i.img?"":`<span class="wm">${esc((i.name||"?").trim().charAt(0).toUpperCase())}</span>`}<div class="shade"></div><div class="badge">${esc(cname(i.cat))}</div>${fe(i)?'<div class="fbd">Featured</div>':""}<h3>${esc(i.name)}</h3></div><div class="cb">
   ${i.status&&i.status!=="approved"?`<div class="stat">${i.status==="pending"?t("pend"):esc(i.status)}</div>`:""}
   <div class="loc">${PIN}<span>${esc(i.area)}, ${esc(i.dist)}, ${esc(sname(i.state)||i.state)}</span>${dtxt(i)}</div>
   ${i.verified?`<div class="vf">${t("ver")}</div>`:""}
   ${i.desc?`<div class="desc">${esc(i.desc)}</div>`:""}${tags?`<div class="tags">${tags}</div>`:""}
   ${(i.time||i.addr||ex||i.licence)?`<dl class="kv">${i.time?`<dt>${t("tm")}</dt><dd>${esc(i.time)}</dd>`:""}${i.addr?`<dt>${t("ad")}</dt><dd>${esc(i.addr)}</dd>`:""}${ex}${i.licence?`<dt>${esc((LIC[i.cat]||{}).l||"Licence")}</dt><dd>${esc(i.licence)}</dd>`:""}</dl>`:""}
   <div class="acts"><a class="p" data-t="call" data-sid="${esc(i.id)}" href="tel:+91${ph}">${t("call")}</a><a data-t="wa" data-sid="${esc(i.id)}" href="https://wa.me/91${ph}" target="_blank" rel="noopener noreferrer">${t("wa")}</a><a data-t="dir" data-sid="${esc(i.id)}" href="${esc(dir(i))}" target="_blank" rel="noopener noreferrer">${t("dir")}</a></div>
   ${mine&&db?`<div class="stats">Views ${i.views||0} · Calls ${i.calls||0} · WhatsApp ${i.wa||0} · Directions ${i.dirs||0}</div>`:""}
   <div class="minor"><button data-share="${esc(i.id)}">Share</button>${mine?`<button data-edit="${esc(i.id)}">${t("edit")}</button><button data-del="${esc(i.id)}">${t("del")}</button>`:`<button data-rep="${esc(i.id)}">${t("rep")}</button>`}</div>
  </div></article>`}).join("");
 $("grid").querySelectorAll("[data-share]").forEach(b=>b.onclick=()=>shareShop(b.dataset.share));
 if(window.IntersectionObserver){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);track(e.target.id.slice(2),"view")}}),{threshold:.5});$("grid").querySelectorAll(".card[id]").forEach(c=>io.observe(c))}
 $("grid").querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openEdit(items.find(x=>x.id===b.dataset.edit)));
 $("grid").querySelectorAll("[data-rep]").forEach(b=>b.onclick=()=>{
  if(!db){note("Reporting works on the live site.");return}
  if(!uid){$("adlg").showModal();return}
  repId=b.dataset.rep;$("rr").value="";$("rn").value="";$("rst").textContent="";$("rdlg").showModal()});
 $("grid").querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{
  if(!confirm("Delete this listing?"))return;
  try{if(db)await delRemote(b.dataset.del);else{items=items.filter(x=>x.id!==b.dataset.del);render()}}catch(e){note("You do not have permission to delete this listing.")}});
}

function drawFormDist(){fillSel($("f_dist"),D[$("f_state").value||"Tamil Nadu"].map(d=>[d,d]))}
function drawXtra(){
 const c=$("f_cat").value||CK[0],L=LIC[c];
 $("xtra").innerHTML=`<h4>${esc(t("det"))}: ${esc(cname(c))}</h4>`+CATS[c].map(l=>`<label>${esc(l)}</label><input data-x="${esc(l)}" maxlength="120">`).join("")+(L?`<label>${esc(L.l)}${L.r?" *":" (optional)"}</label><input id="f_lic" maxlength="60" autocomplete="off">`:"");
}
$("f_cat").onchange=drawXtra;$("f_state").onchange=drawFormDist;
$("state").onchange=()=>{drawDist();render()};$("vonly").onclick=()=>{vonly=!vonly;$("vonly").classList.toggle("on",vonly);render()};
$("dist").onchange=render;$("q").addEventListener("input",render);
let imgData="";
$("f_img").onchange=e=>{
 const f=e.target.files[0];if(!f)return;
 const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
  const w=Math.min(640,im.width),h=im.height*w/im.width,cv=document.createElement("canvas");cv.width=w;cv.height=h;
  cv.getContext("2d").drawImage(im,0,0,w,h);imgData=cv.toDataURL("image/jpeg",.7);
  $("pv").src=imgData;$("pv").style.display="block"};im.src=r.result};r.readAsDataURL(f);
};
function resetForm(){$("form").reset();imgData="";fpos=null;editId=null;$("pv").style.display="none";$("locst").textContent="";drawFormDist();drawXtra()}
function openAdd(){if(db&&!uid){$("adlg").showModal();return}resetForm();$("dlg").showModal()}
function openEdit(it){
 if(!it)return;resetForm();editId=it.id;
 $("f_name").value=it.name||"";$("f_cat").value=it.cat;drawXtra();$("f_state").value=it.state;drawFormDist();$("f_dist").value=it.dist;
 $("f_area").value=it.area||"";$("f_ph").value=it.ph||"";$("f_time").value=it.time||"";$("f_addr").value=it.addr||"";$("f_map").value=it.map||"";$("f_desc").value=it.desc||"";$("f_tags").value=(it.tags||[]).join(", ");
 $("xtra").querySelectorAll("[data-x]").forEach(x=>{x.value=(it.extra||{})[x.dataset.x]||""});
 if($("f_lic"))$("f_lic").value=it.licence||"";
 if(it.lat!=null)fpos={lat:it.lat,lng:it.lng};
 $("dlg").showModal();
}
$("form").addEventListener("submit",e=>e.preventDefault());
$("addBtn").onclick=$("fab").onclick=$("pfree").onclick=openAdd;
$("cancel").onclick=()=>$("dlg").close();
$("save").onclick=async()=>{
 if($("f_web").value)return;
 const g=id=>clean($(id).value);
 const digits=g("f_ph").replace(/\D/g,"").slice(-10);
 if(g("f_name").length<2||!g("f_area")){alert("Please fill the business name and locality.");return}
 if(!/^[6-9]\d{9}$/.test(digits)){alert("Please enter a valid 10-digit Indian mobile number.");return}
 const c=$("f_cat").value,L=LIC[c];
 if(L&&L.r&&!($("f_lic")&&clean($("f_lic").value))){alert("Please enter your "+L.l+".");return}
 if(!$("f_ack").checked){alert("Please tick the declaration that your listing is legal and allowed.");return}
 const extra={};$("xtra").querySelectorAll("[data-x]").forEach(x=>{const v=clean(x.value);if(v)extra[x.dataset.x]=v.slice(0,120)});
 const rec={name:g("f_name"),cat:c,state:$("f_state").value,dist:$("f_dist").value,area:g("f_area"),ph:digits,time:g("f_time"),addr:g("f_addr"),map:g("f_map"),desc:g("f_desc"),licence:$("f_lic")?clean($("f_lic").value):"",
  tags:g("f_tags").split(",").map(s=>clean(s)).filter(Boolean).slice(0,12),extra,img:imgData,...(fpos?{lat:fpos.lat,lng:fpos.lng}:{}),editId};
 if(BLOCK.test([rec.name,rec.desc,rec.tags.join(" "),rec.addr,Object.values(extra).join(" ")].join(" "))){alert("This listing mentions items or services that are not allowed on Nalvo (see the list in the form). Please remove them.");return}
 if(rec.map&&!/^https:\/\/\S+$/.test(rec.map)){alert("The Google Maps link must start with https://");return}
 if(Date.now()-lastSub<60000){alert("Please wait a minute before submitting again.");return}
 const wasEdit=!!editId;
 try{
  if(db)await saveRemote(rec);
  else{if(wasEdit)items=items.map(x=>x.id===editId?{...x,...rec}:x);else items.unshift({id:"b"+Date.now().toString(36),owner:"anon",created:Date.now(),status:"pending",...rec});drawDist();render()}
  lastSub=Date.now();$("dlg").close();resetForm();
  alert(wasEdit?"Saved. Your changes are sent for review and the listing reappears once approved.":"Thank you! Your listing is sent for review and will appear once approved, usually within 1-2 days.");
 }catch(e){alert("Could not save: "+(e.message||"no permission to add listings"))}
};
$("near").onclick=()=>{
 if(pos){pos=null;$("near").classList.remove("on");render();return}
 if(!navigator.geolocation){note(t("locErr"));return}
 navigator.geolocation.getCurrentPosition(p=>{pos={lat:p.coords.latitude,lng:p.coords.longitude};$("near").classList.add("on");note("");render()},()=>note(t("locErr")),{timeout:10000});
};
$("getloc").onclick=()=>{
 if(!navigator.geolocation){$("locst").textContent=t("locErr");return}
 navigator.geolocation.getCurrentPosition(p=>{fpos={lat:p.coords.latitude,lng:p.coords.longitude};$("locst").textContent=t("locOk")},()=>{$("locst").textContent=t("locErr")},{timeout:10000});
};
applyLang();

// ---- Backend (Supabase) ----
// Paste your own values from Supabase: Project Settings > API. The anon key is meant to be public.
const SB_URL=(window.NALVO_CONFIG||{}).url||"YOUR-PROJECT",SB_KEY=(window.NALVO_CONFIG||{}).key||"";
let saveRemote=null,delRemote=null;
(async()=>{
 if(!window.supabase||SB_URL.includes("YOUR-PROJECT")||!SB_KEY||SB_KEY.includes("YOUR-ANON")){note("Preview mode: listings you add stay on this device only. Connect Supabase to go live (see SETUP.md).");loaded=true;render();return}
 const sb=window.supabase.createClient(SB_URL,SB_KEY);
 db=sb;
 const ses=await sb.auth.getSession();uid=ses.data.session?ses.data.session.user.id:null;
 const setSO=()=>{$("so").hidden=!uid};setSO();$("so").onclick=()=>sb.auth.signOut();
 sb.auth.onAuthStateChange((_e,x)=>{uid=x?x.user.id:null;setSO();render()});
 $("rcancel").onclick=()=>$("rdlg").close();
 trackFn=(id,k)=>{sb.rpc("track",{p_id:id,p_kind:k}).then(()=>{},()=>{})};
 $("rsend").onclick=async()=>{
  const reason=$("rr").value;if(!reason){$("rst").textContent="Please choose a reason.";return}
  const r=await sb.from("reports").insert({listing_id:repId,reason,note:clean($("rn").value).slice(0,300)||null});
  $("rst").textContent=r.error?(r.error.code==="23505"?"You have already reported this listing.":"Could not send. Please try again."):"Thank you. We will review this listing.";
  if(!r.error)setTimeout(()=>$("rdlg").close(),1500);
 };
 async function load(){
  const r=await sb.from("listings").select("*").order("created_at",{ascending:false});
  if(r.error){loaded=true;render();note("Could not load listings. Please try again.");return}
  items=r.data.map(x=>({...x,desc:x.descr,time:x.timings,map:x.maplink,created:Date.parse(x.created_at),img:(x.img&&x.img.startsWith(SB_URL+"/storage/"))?x.img:null}));loaded=true;setTimeout(gotoHash,60);
  drawDist();render();
 }
 saveRemote=async rec=>{
  let img=null;
  if(rec.img){
   const path=uid+"/"+crypto.randomUUID()+".jpg";
   const blob=await (await fetch(rec.img)).blob();
   const up=await sb.storage.from("photos").upload(path,blob,{contentType:"image/jpeg"});
   if(up.error)throw up.error;
   img=sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
  }
  const row={name:rec.name,cat:rec.cat,state:rec.state,dist:rec.dist,area:rec.area,ph:rec.ph,timings:rec.time||null,addr:rec.addr||null,maplink:rec.map||null,descr:rec.desc||null,tags:rec.tags,extra:rec.extra,licence:rec.licence||null,ack:true};
  if(img)row.img=img;
  if(rec.lat!=null){row.lat=rec.lat;row.lng=rec.lng}
  const r=rec.editId?await sb.from("listings").update(row).eq("id",rec.editId):await sb.from("listings").insert(row);
  if(r.error)throw r.error;
  await load();
 };
 delRemote=async id=>{const r=await sb.from("listings").delete().eq("id",id);if(r.error)throw r.error;await load()};
 $("acancel").onclick=()=>$("adlg").close();
 $("asend").onclick=async()=>{
  const em=$("aem").value.trim();
  if(!/^\S+@\S+\.\S+$/.test(em)){$("ast").textContent="Please enter a valid email.";return}
  $("ast").textContent="Sending...";
  const r=await sb.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.origin+location.pathname}});
  $("ast").textContent=r.error?r.error.message:"Check your email and tap the link. Then come back and click List your business.";
 };
 await load();
})();
