import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'
import { EventType } from '@angular/router';
import { HtmlParser } from '@angular/compiler';
declare var require: any
var debounce = require('debounce');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  scoreboardMin:string  = "00"
  scoreboardSec: string = "00"
  btnStart:HTMLElement = document.getElementById("start")!
  btnWait:HTMLElement = document.getElementById("wait")!
  btnReset:HTMLElement = document.getElementById("reset")!
  timeID: any
  

  ngOnInit(): void { 

    this.btnStart = document.getElementById("start")!
    this.btnWait = document.getElementById("wait")!
    this.btnReset = document.getElementById("reset")!
    
    const clicl$ = new Observable(observer => {
      const btnBox = document.getElementById("box")

      if (!btnBox) {
        observer.error("Failed to communicate with stopwatch interface")
        return
      }

      btnBox.addEventListener("click", event => {
        observer.next(event.target)
      })
    })

    clicl$.subscribe(target=> {
      let name:any = target
      if (name.innerHTML === "Start") {
        
        this.start()

        this.btnWait.addEventListener("dblclick", debounce(this.wait, 500,
          {
            leading: true,
            trailing: false,
          }))
        
      } else if (name.innerHTML === "Stop") {
        
        this.stop()
      } else if (name.innerHTML === "Wait") {
        
        return
      } else {
        
        this.reset()
      }
      
    })
  }

  convertMs = (ms :number) => {
      const msInSec = 1000;
      const msInMin = msInSec * 60;
  
      const minutes = Math.floor(ms / msInMin);
      const seconds = Math.floor((ms % msInMin) / msInSec);

      return { minutes, seconds };
  }

  start = (): void => {

    let startTime: number = 0
    
    if(this.scoreboardMin !=="00" || this.scoreboardSec !=="00") {
      startTime = +(new Date) - Number(this.scoreboardSec)*1000 - Number(this.scoreboardMin)*60000
    } else {
      startTime = +(new Date)
    }
    
    this.btnStartTransform()

    this.timeID = setInterval(() => {
      const delta = +(new Date) - +(startTime)
      const stopwatchTime = this.convertMs(delta)
      this.scoreboardMin = String(stopwatchTime.minutes)
        .padStart(2, "0")
      this.scoreboardSec = String(stopwatchTime.seconds)
        .padStart(2, "0")
    },1000)
  }

  stop = (): void => {
    
    this.btnStopTransfotm()

    clearInterval(this.timeID)
    this.scoreboardMin = "00"
    this.scoreboardSec = "00"
    this.btnWait.removeEventListener("dblclick", debounce(this.wait, 500,
          {
            leading: true,
            trailing: false,
          }))
  }

  wait = (): void => {
    this.btnWaitTransform()
    clearInterval(this.timeID)
    this.btnWait.removeEventListener("dblclick", debounce(this.wait, 500,
          {
            leading: true,
            trailing: false,
          }))
  }

  reset = (): void => {
    this.btnStopTransfotm()
    this.scoreboardMin  = "00"
    this.scoreboardSec = "00"
    clearInterval(this.timeID)
    this.start()
  }

  btnStartTransform = () => {
    this.btnStart.setAttribute("id","stop")
    this.btnStart = document.getElementById("stop")!
    this.btnStart .classList.replace( "btn-start", "btn-stop")
    this.btnStart.innerHTML = "Stop"
    this.btnWait.removeAttribute("disabled")
    this.btnReset.removeAttribute("disabled")
  }
  btnStopTransfotm = () => {
    this.btnStart.setAttribute("id","start")
    this.btnStart = document.getElementById("start")!
    this.btnStart .classList.replace("btn-stop", "btn-start")
    this.btnStart.innerHTML = "Start" 
    this.btnWait.setAttribute("disabled", 'true')
    this.btnReset.setAttribute("disabled", 'true')
  }
  btnWaitTransform = () => {
    this.btnStart.setAttribute("id","start")
    this.btnStart = document.getElementById("start")!
    this.btnStart .classList.replace("btn-stop", "btn-start")
    this.btnStart.innerHTML = "Start" 
    this.btnWait.removeAttribute("disabled")
    this.btnReset.removeAttribute("disabled")
  }
}
