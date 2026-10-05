(function () {
  'use strict';
  var canvas=document.getElementById('haze-rain'); if(!canvas) return;
  var ctx=canvas.getContext('2d'); if(!ctx) return;
  var glyphs='0123456789アイウエオカキクケコサシスセソタチツテト△□○+<>', streams=[],last=0,frame;
  var reduced=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    canvas.width=Math.min(innerWidth,1920);canvas.height=Math.min(innerHeight,1080);
    streams=[];
    for(var x=0;x<canvas.width;x+=22) streams.push({x:x,y:Math.random()*(canvas.height+500)-500,speed:35+Math.random()*90,length:14+Math.floor(Math.random()*28),purple:Math.random()<.24,seed:Math.floor(Math.random()*glyphs.length)});
    draw(0);
  }
  function draw(dt){
    ctx.fillStyle='#010410';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.font='15px monospace';
    streams.forEach(function(s){
      s.y+=s.speed*dt;if(s.y-s.length*18>canvas.height){s.y=-20;s.speed=35+Math.random()*90;}
      for(var j=s.length;j>=0;j--){
        var y=s.y-j*18;if(y<0||y>canvas.height)continue;
        ctx.globalAlpha=(1-j/s.length)*.8;ctx.fillStyle=j===0?'#c6faff':s.purple?'#9457ff':'#00b9ff';
        ctx.shadowBlur=j<3?9:0;ctx.shadowColor=s.purple?'#773bff':'#00bfff';
        ctx.fillText(glyphs[(s.seed+j*7+Math.floor(s.y/60))%glyphs.length],s.x,y);
      }
    });
    ctx.globalAlpha=1;ctx.shadowBlur=0;
    var g=ctx.createRadialGradient(canvas.width/2,canvas.height*.45,30,canvas.width/2,canvas.height*.45,canvas.width*.48);
    g.addColorStop(0,'rgba(1,4,16,.92)');g.addColorStop(.65,'rgba(1,4,16,.55)');g.addColorStop(1,'rgba(1,4,16,0)');ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  function tick(now){frame=requestAnimationFrame(tick);if(document.hidden){last=now;return;}if(now-last<40)return;draw(Math.min((now-last)/1000,.1));last=now;}
  resize();addEventListener('resize',resize);if(!reduced)frame=requestAnimationFrame(tick);
  addEventListener('pagehide',function(){cancelAnimationFrame(frame);});
  addEventListener('pageshow',function(e){if(e.persisted&&!reduced){last=performance.now();frame=requestAnimationFrame(tick);}});
})();
