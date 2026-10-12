from pathlib import Path
p=Path("app.js")
s=p.read_text()
old='loadServerSettings=async()=>{try{const A=await l3(),{data:n,error:t}=await A.from("game_settings")'
new='loadServerSettings=async()=>{try{const A=k.sb||await l3(),{data:n,error:t}=await A.from("game_settings")'
if s.count(old)!=1: raise SystemExit(f"anchor count={s.count(old)}")
s=s.replace(old,new)
p.write_text(s)
print("fixed loadServerSettings recursion")
