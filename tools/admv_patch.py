from pathlib import Path
s=Path("app.js").read_text()
for key in ["V6=function","SVR={","loadServerSettings","const t=A*Vt","a=c.tower?0","Math.random()<$s(\"ore\",A)","$s(\"shard\",A)","$s(\"wc\",A)"]:
    i=s.find(key)
    print("KEY",key,"POS",i)
    if i>=0: print(s[max(0,i-220):i+900])
raise SystemExit("diagnostic only")
