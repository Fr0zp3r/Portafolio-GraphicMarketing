// Enhanced Sound System with Web Audio API
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterGainNode = null;
        this.sounds = {};
        this.initialized = false;
        this.isMuted = false;
        this.volume = 0.2; // Default volume
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.gain.value = this.isMuted ? 0 : this.volume;
            this.masterGainNode.connect(this.audioContext.destination);
            
            this.sounds = {
                boot: this.createBootSound(),
                click: this.createClickSound(),
                hover: this.createHoverSound(),
                transition: this.createTransitionSound(),
                open: this.createOpenSound(),
                close: this.createCloseSound()
            };
            
            this.initialized = true;
        } catch (e) {
            console.log('Audio initialization failed:', e);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGainNode) {
            this.masterGainNode.gain.setValueAtTime(
                this.isMuted ? 0 : this.volume,
                this.audioContext.currentTime
            );
        }
        return this.isMuted;
    }
    
    createBootSound() {
        return () => {
            if (this.isMuted) return;
            const osc1 = this.audioContext.createOscillator();
            const osc2 = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc1.frequency.setValueAtTime(100, this.audioContext.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(200, this.audioContext.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc1.start();
            osc2.start();
            osc1.stop(this.audioContext.currentTime + 0.5);
            osc2.stop(this.audioContext.currentTime + 0.5);
        };
    }
    
    createClickSound() {
        return () => {
            if (this.isMuted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            osc.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    createHoverSound() {
        return () => {
            if (this.isMuted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.05);
        };
    }

    createTransitionSound() {
        return () => {
            if (this.isMuted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2);
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.3);
        };
    }

    createOpenSound() { return this.createClickSound(); }
    createCloseSound() { return this.createClickSound(); }
    
    play(soundName) {
        if (!this.initialized || this.isMuted || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName]();
        } catch (e) {
            console.log('Sound playback error:', e);
        }
    }
}

// SVG Icons Store
const projectIcons = {
    summit: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 350">
  <defs>
    <style>
      .cls-1 {
        font-size: 4.33px;
      }

      .cls-1, .cls-2 {
        fill: #f9f7d4;
        font-family: CascadiaMonoRoman-Light, 'Cascadia Mono';
        font-variation-settings: 'wght' 300;
        font-weight: 300;
      }

      .cls-2 {
        font-size: 7.59px;
      }
    </style>
  </defs>
  <text></text>
  <text class="cls-1" transform="translate(11.72 14.69) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                           █████                                   </tspan><tspan x="0" y="5.2" xml:space="preserve">                                                                        █████▒███                                  </tspan><tspan x="0" y="10.39" xml:space="preserve">         █████                                                       ████▒▒▒▒▒▒██                                  </tspan><tspan x="0" y="15.59" xml:space="preserve">        ███▓█████                                                ██████▒▒▒▒▒▒▒▒██                                  </tspan><tspan x="0" y="20.79" xml:space="preserve">        ██▒▒▒▒▒████                                            ███████▒▒▒▒▒▒▒▒▒██                                  </tspan><tspan x="0" y="25.98" xml:space="preserve">       ███▒▒▒▒▒▒▒▒█████                                       ███░░░███▒▒▒▒▒▓████                                  </tspan><tspan x="0" y="31.18" xml:space="preserve">        ██▒▒▒▒▒▒▒▒▒██████                                    ██▒░░░░░██▒█████████                                  </tspan><tspan x="0" y="36.38" xml:space="preserve">        ████▒▒▒▒▒▒███░░▒███                                 ██▓░░░░░░█████░░░░███                                  </tspan><tspan x="0" y="41.57" xml:space="preserve">        ████████▒▓██░░░░░███                                ██░░░░░░░███▒░░░░░██                                   </tspan><tspan x="0" y="46.77" xml:space="preserve">        ██▓░░░▓████▓░░░░░░███                               ██░░░░░░░███▒░░░░███                                   </tspan><tspan x="0" y="51.97" xml:space="preserve">        ███░░░░▒▒██░░░░░░░▓██                              ███▒░░░░░░██▒░░░░▓██                                    </tspan><tspan x="0" y="57.16" xml:space="preserve">         ██░░░░░▒██░░░░░░░▒██                             █████▓░░░░███░░░░███                                     </tspan><tspan x="0" y="62.36" xml:space="preserve">         ███░░░░▒██▓░░░░░░███                            ███▒▒███▒░▒██░░░▓███                                      </tspan><tspan x="0" y="67.56" xml:space="preserve">          ███░░░░▓██░░░░░███                            ███▒▒▒▒▒███████████                                        </tspan><tspan x="0" y="72.75" xml:space="preserve">           ████░░░███░░▒████                          ████░▒▒▒▒▒▒▒▒████                 ███████████████            </tspan><tspan x="0" y="77.95" xml:space="preserve">             ████████████▒▒██                       ██████░░▒▒▒▒▒███                 █████▒░░░█████████████        </tspan><tspan x="0" y="83.15" xml:space="preserve">                █████▓▒▒▒▒▒░████                  ████░▒██░░░▒▒▒███                 ███░░░░░░░██▒▒▒▒▒▒▒▒▒███       </tspan><tspan x="0" y="88.34" xml:space="preserve">                 ███▒▒▒▒▒▒░░█████               ████  ░▓██░░░░░███                 ██░░░░░░░░██▒▒▒▒▒▒▒▒▒███        </tspan><tspan x="0" y="93.54" xml:space="preserve">                  ███▒▒▒░░░░███░███            ███   ░░███░░░░███                 ███░░░░░░░██████▓▒▒▒▒███         </tspan><tspan x="0" y="98.74" xml:space="preserve">                   ███░░░░░░███░░███          ██▒░░ ░░░██░░░░███               █████▒░░░░░▒███▒▒████████           </tspan><tspan x="0" y="103.93" xml:space="preserve">                    ███░░░░░██▓░░░███        ███░░░░░░███░░░███             ████▓▒███░░░▒███▒▒░░░░░▓███            </tspan><tspan x="0" y="109.13" xml:space="preserve">                     ███░░░░██▒░░░░██        ███▒▒░░░▒██░░░███          ██████░▒▒▒▒███████░░░░░░░████              </tspan><tspan x="0" y="114.33" xml:space="preserve">                      ██▒░░░██▓▒▒▒▒██         ███▒▒▒███░░░███      ███████░██▓▒▒▒▒▒▒███▒░░░░░░▒████                </tspan><tspan x="0" y="119.52" xml:space="preserve">                       ██░░░░████████          ███████░░░███    █████░  ░░███░▒▒▒▒▒▒████████████                   </tspan><tspan x="0" y="124.72" xml:space="preserve">                       ███░░░░▒██████         ███▒▒▒▒░░░███    ███▒░░░░░░███░░▒▒▒▓████                             </tspan><tspan x="0" y="129.92" xml:space="preserve">                        ███░░░░░▒▒▒███       ███░░░░░░░▒██     ███▒▒▒░▒███░░░░░████                                </tspan><tspan x="0" y="135.11" xml:space="preserve">                         ██▓░░░░░░░░██       ██░░░░░░░░██       ████████░░░░▒████                                  </tspan><tspan x="0" y="140.31" xml:space="preserve">                         █████░░░░░░███     ██▓░░░░░░░███     ███▒▒▓▒▒░░░░▒███                                     </tspan><tspan x="0" y="145.51" xml:space="preserve">                         ██░███▒░░░░░██    ███░░░░░░░▓██    ███▒░░░░░░░░▒███                                       </tspan><tspan x="0" y="150.7" xml:space="preserve">                         ██  ░███░░░░▒██   ██░░░░░░░░██    ███░░░░░░░░░███                                         </tspan><tspan x="0" y="155.9" xml:space="preserve">                         ██   ░███░░░░███ ███░░░░░░░███  ███▒░░░░░░░░███                                           </tspan><tspan x="0" y="161.1" xml:space="preserve">                         ██ ░ ░░██▒░░░▒██ ██░░░░░░░███  ███░░░░░░░█████                                            </tspan><tspan x="0" y="166.29" xml:space="preserve">                         ███░░░░▒██░░▒▒████▒░░░░░█████████▒░░░░░███▓██                                             </tspan><tspan x="0" y="171.49" xml:space="preserve">                          ██░░░░▒██▒▒▒▒▒███░░░░░███░▒███▓▒░░░░███░░███                                             </tspan><tspan x="0" y="176.69" xml:space="preserve">                          ███▒▒▒▒██▒▒▒▒▒██▒░░░░███░░░██▒▒▒░░░███░░▒██                                              </tspan><tspan x="0" y="181.88" xml:space="preserve">                           ███████▒▒▒▒▒▓██░░░░███░░░░██▒▒▒░▒██░░░░███                                              </tspan><tspan x="0" y="187.08" xml:space="preserve">                               ███▒▒▒▒▒██▒░░░███░░░░▒██▒▒▒▒██░░░░░██                                               </tspan><tspan x="0" y="192.28" xml:space="preserve">                                ██▒▒▒▒▒██░░░░██░░░░░███▒▒▒▓██▒░░░███                                               </tspan><tspan x="0" y="197.47" xml:space="preserve">                                ███▒▒▒███░░░▒██▒░░░░██▒▒▒▒▒██▓▒▒███                                                </tspan><tspan x="0" y="202.67" xml:space="preserve">                                 ██▒▒▒██░░░░▒██▒▒▒▒███▒▒▒▒████████                                                 </tspan><tspan x="0" y="207.87" xml:space="preserve">                                 ███▒███░░░░░▓██████▓▒▒▒▒███                                                       </tspan><tspan x="0" y="213.06" xml:space="preserve">                                  ███████░░░░▒▒▓██▒▒▒▒▒▒▓██                                                        </tspan><tspan x="0" y="218.26" xml:space="preserve">                                  ███▓░███░░░░▒██▓▒▒▒▒▒▒██                                                         </tspan><tspan x="0" y="223.46" xml:space="preserve">                                  ███ ░░██▒░░░░██▒▒▒▒▒▒███                                                         </tspan><tspan x="0" y="228.65" xml:space="preserve">                                 ███  ░░▓██░░░░██▒▒▒▒▒▒██                                                          </tspan><tspan x="0" y="233.85" xml:space="preserve">                                 ██░ ░░░░██░░░▓██▒▒▒▒▒███                                                          </tspan><tspan x="0" y="239.05" xml:space="preserve">                                 ██░░░░░░██░░░███▒▒▒▓█████                                                         </tspan><tspan x="0" y="244.24" xml:space="preserve">                                 ██░░░░░▓██░░░██▓▒▒▒██░░███                                                        </tspan><tspan x="0" y="249.44" xml:space="preserve">                                 ███▒▒▒▒██▒░░░██▒▒▒██▒░░░███                                                       </tspan><tspan x="0" y="254.64" xml:space="preserve">                                  ███████▒░░░░██▒▒▒██░░░░░██                                                       </tspan><tspan x="0" y="259.83" xml:space="preserve">                                   ███▒▒▒░░░░░██▒▒▓██░░░░░██                                                       </tspan><tspan x="0" y="265.03" xml:space="preserve">                                   ███▒░░░░░░░██▒▒▒██▒░░░▒██                                                       </tspan><tspan x="0" y="270.23" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒██▒▒▒▒██                                                        </tspan><tspan x="0" y="275.43" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒███▒███                                                         </tspan><tspan x="0" y="280.62" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒▒████                                                           </tspan><tspan x="0" y="285.82" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒▒███                                                            </tspan><tspan x="0" y="291.02" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒▒███                                                            </tspan><tspan x="0" y="296.21" xml:space="preserve">                                   ███░░░░░░░░██▒▒▒▒▓██                                                            </tspan><tspan x="0" y="301.41" xml:space="preserve">                                    ██░░░░░░░░██▒▒▒▒▒██                                                            </tspan><tspan x="0" y="306.61" xml:space="preserve">                                    ██░░░░░░░░██▓▒▒▒███                                                            </tspan><tspan x="0" y="311.8" xml:space="preserve">                                    ██▓░░░░░░░██▒▒▒███                                                             </tspan><tspan x="0" y="317" xml:space="preserve">                                     ████░░▓████████                                                               </tspan><tspan x="0" y="322.2" xml:space="preserve">                                       ██████                                                                      </tspan></text>
  <text></text>
  <text class="cls-2" transform="translate(-440.01 -46.88) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="9.11" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="18.23" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="27.34" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="36.45" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="45.56" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="54.68" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="63.79" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="72.9" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="82.01" xml:space="preserve">                                                   ▒                                                               </tspan><tspan x="0" y="91.13" xml:space="preserve">                                                   ▒▒                                                              </tspan><tspan x="0" y="100.24" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="109.35" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="118.47" xml:space="preserve">                                                     ▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="127.58" xml:space="preserve">                                                ▒▒▒▒      ▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="136.69" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒ ▒▒▒▒   ▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="145.8" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒░                                           </tspan><tspan x="0" y="154.92" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="164.03" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒                                         </tspan><tspan x="0" y="173.14" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒                                         </tspan><tspan x="0" y="182.25" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒                                        </tspan><tspan x="0" y="191.37" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                        </tspan><tspan x="0" y="200.48" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="209.59" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="218.71" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="227.82" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ░▒▒▒▒                                       </tspan><tspan x="0" y="236.93" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="246.04" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="255.16" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="264.27" xml:space="preserve">                                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="273.38" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="282.5" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="291.61" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="300.72" xml:space="preserve">                                              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="309.83" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                              </tspan><tspan x="0" y="318.95" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="328.06" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                </tspan><tspan x="0" y="337.17" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="346.28" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                    </tspan><tspan x="0" y="355.4" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒                                                      </tspan><tspan x="0" y="364.51" xml:space="preserve">                                                 ▒▒▒▒▒▒▒▒▒▒                                                        </tspan><tspan x="0" y="373.62" xml:space="preserve">                                                  ▒▒▒▒▒▒                                                           </tspan><tspan x="0" y="382.74" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="391.85" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="400.96" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="410.07" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="419.19" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="428.3" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="437.41" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="446.52" xml:space="preserve">                                                                                                                   </tspan></text>
</svg>`,
    tech: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 350">
  <defs>
    <style>
      .cls-1 {
        font-size: 7.59px;
      }

      .cls-1, .cls-2 {
        fill: #f9f7d4;
        font-family: CascadiaMonoRoman-Light, 'Cascadia Mono';
        font-variation-settings: 'wght' 300;
        font-weight: 300;
      }

      .cls-2 {
        font-size: 3.83px;
      }
    </style>
  </defs>
  <text></text>
  <text class="cls-2" transform="translate(28.88 12.56) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                           ███     </tspan><tspan x="0" y="4.59" xml:space="preserve">                                                                                         ███               ████    </tspan><tspan x="0" y="9.19" xml:space="preserve">                                                                                        ████              █████    </tspan><tspan x="0" y="13.79" xml:space="preserve">                                                                                        █████             ██████   </tspan><tspan x="0" y="18.38" xml:space="preserve">                                                                       ███              ██████            ██████   </tspan><tspan x="0" y="22.98" xml:space="preserve">                                                                       ████             ███████          ███████   </tspan><tspan x="0" y="27.57" xml:space="preserve">                                                                       █████            ████████         ████████  </tspan><tspan x="0" y="32.17" xml:space="preserve">                                                                       ███████          ████████        █████████  </tspan><tspan x="0" y="36.76" xml:space="preserve">                                                     ███               ████████         █████████       ██████████ </tspan><tspan x="0" y="41.36" xml:space="preserve">                                                      ████             █████████        ██████████      ██████████ </tspan><tspan x="0" y="45.95" xml:space="preserve">                                                      ██████            █████████       ███████████    ███████████ </tspan><tspan x="0" y="50.55" xml:space="preserve">                                                      ████████          ██████████      ███████████    ████████████</tspan><tspan x="0" y="55.15" xml:space="preserve">                                                       ████████         ███████████     ████████████   ████████████</tspan><tspan x="0" y="59.74" xml:space="preserve">                                                        █████████       ████████████    ████████████   ████████████</tspan><tspan x="0" y="64.34" xml:space="preserve">                                      ▒▒▒               ███████████      ████████████   ████████████   ████████████</tspan><tspan x="0" y="68.93" xml:space="preserve">                                      ▒▒▒▒▒▒             ███████████     █████████████  █████████████ █████████████</tspan><tspan x="0" y="73.53" xml:space="preserve">                                       ▒▒▒▒▒▒▒           ████████████    ██████████████ █████████████ █████████████</tspan><tspan x="0" y="78.12" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒         █████████████   █████████████ █████████████ █████████████</tspan><tspan x="0" y="82.72" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒        █████████████   █████████████ ██████████████████████████</tspan><tspan x="0" y="87.31" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒       █████████████  ████████████████████████████████████████</tspan><tspan x="0" y="91.91" xml:space="preserve">                                           ▒▒▒▒▒▒▒▒▒▒▒▒     ██████████████  ███████████████████████████████████████</tspan><tspan x="0" y="96.5" xml:space="preserve">                         ▒▒                 ▒▒▒▒▒▒▒▒▒▒▒▒▒    ██████████████████████████████████████████████████████</tspan><tspan x="0" y="101.1" xml:space="preserve">                         ▒▒▒▒▒▒              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒   █████████████████████████████████████████████████████</tspan><tspan x="0" y="105.7" xml:space="preserve">                          ▒▒▒▒▒▒▒▒            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ████████████████████████████████████████████████████</tspan><tspan x="0" y="110.29" xml:space="preserve">                           ▒▒▒▒▒▒▒▒▒▒▒         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ███████████████████████████████████████████████████</tspan><tspan x="0" y="114.89" xml:space="preserve">                             ▒▒▒▒▒▒▒▒▒▒▒▒▒      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ██████████████████████████████████████████████████</tspan><tspan x="0" y="119.48" xml:space="preserve">                              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████████████████████████████████████████████████</tspan><tspan x="0" y="124.08" xml:space="preserve">                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███████████████████████████████████████████████ </tspan><tspan x="0" y="128.67" xml:space="preserve">                                 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█████████████████████████████████████████████ </tspan><tspan x="0" y="133.27" xml:space="preserve">                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████████████████████████████████████████ </tspan><tspan x="0" y="137.86" xml:space="preserve">              ▒▒▒▒▒                 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███████████████████████████████████████████ </tspan><tspan x="0" y="142.46" xml:space="preserve">               ▒▒▒▒▒▒▒▒▒▒▒▒           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████████████████████████████████████ </tspan><tspan x="0" y="147.05" xml:space="preserve">                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████████████████████████████████████████ </tspan><tspan x="0" y="151.65" xml:space="preserve">                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███████████████████████████████████████ </tspan><tspan x="0" y="156.25" xml:space="preserve">                    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████████████████████████████████ </tspan><tspan x="0" y="160.84" xml:space="preserve">                      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████████████████████████████████████ </tspan><tspan x="0" y="165.44" xml:space="preserve">                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████████████████████████████  </tspan><tspan x="0" y="170.03" xml:space="preserve">                          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████████████████████████████████  </tspan><tspan x="0" y="174.63" xml:space="preserve">                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓███████████████████████████████  </tspan><tspan x="0" y="179.22" xml:space="preserve">       ▒▒▒▒▒                   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████████████████████████  </tspan><tspan x="0" y="183.82" xml:space="preserve">      ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████████████████████████████  </tspan><tspan x="0" y="188.41" xml:space="preserve">        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓███████████████████████████  </tspan><tspan x="0" y="193.01" xml:space="preserve">           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████████████████████████   </tspan><tspan x="0" y="197.61" xml:space="preserve">              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████████████████████   </tspan><tspan x="0" y="202.2" xml:space="preserve">                 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓██████████████████████   </tspan><tspan x="0" y="206.8" xml:space="preserve">                    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█████████████████████   </tspan><tspan x="0" y="211.39" xml:space="preserve">                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████████████████   </tspan><tspan x="0" y="215.99" xml:space="preserve">                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓██████████████████   </tspan><tspan x="0" y="220.58" xml:space="preserve">                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█████████████████   </tspan><tspan x="0" y="225.18" xml:space="preserve">  ████████████████████████████████ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████████████   </tspan><tspan x="0" y="229.77" xml:space="preserve">  ███████████████████████████████████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████████    </tspan><tspan x="0" y="234.37" xml:space="preserve">    ███████████████████████████████████████████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████████████    </tspan><tspan x="0" y="238.96" xml:space="preserve">        ██████████████████████████████████████████████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███████████    </tspan><tspan x="0" y="243.56" xml:space="preserve">             ████████████████████████████████████████████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████████    </tspan><tspan x="0" y="248.16" xml:space="preserve">                  █████████████████████████████████████████████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓████████    </tspan><tspan x="0" y="252.75" xml:space="preserve">                        ██████████████████████████████████████████████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███████    </tspan><tspan x="0" y="257.35" xml:space="preserve">                               ██████████████████████████████████████████████████▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██████    </tspan><tspan x="0" y="261.94" xml:space="preserve">                  ██████████████████████████████████████████████████████████████████████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓███     </tspan><tspan x="0" y="266.54" xml:space="preserve">         ███████████████████████████████████████████████████████████████████████████████████████▓▓▒▒▒▒▒▒▒▒▒▓██     </tspan><tspan x="0" y="271.13" xml:space="preserve">   █████████████████████████████████████████████████████████████████████████████████████████████████████▓▒▒▒▒█     </tspan><tspan x="0" y="275.73" xml:space="preserve">████████████████████████████████████████████████████████████████████████████████████████████████████████████       </tspan><tspan x="0" y="280.32" xml:space="preserve">   ███████████████████████████████████████████████████████████████████████████████████████████████████             </tspan><tspan x="0" y="284.92" xml:space="preserve">         ███████████████████████████████████████████████████████████████████████████████████████                   </tspan><tspan x="0" y="289.52" xml:space="preserve">                   ███████████████████████████████████████████████████████████████████████                         </tspan><tspan x="0" y="294.11" xml:space="preserve">                               █████████████████████████████████████████████████████                               </tspan><tspan x="0" y="298.71" xml:space="preserve">                        ██████████████████████████████████████████████████████                                     </tspan><tspan x="0" y="303.3" xml:space="preserve">                  ████████████████████████████████████████████████████                                             </tspan><tspan x="0" y="307.9" xml:space="preserve">            ████████████████████████████████████████████████████                                                   </tspan><tspan x="0" y="312.49" xml:space="preserve">        ████████████████████████████████████████████████                                                           </tspan><tspan x="0" y="317.09" xml:space="preserve">    █████████████████████████████████████████████                                                                  </tspan><tspan x="0" y="321.68" xml:space="preserve">  █████████████████████████████████████████                                                                        </tspan><tspan x="0" y="326.28" xml:space="preserve">  ███████████████████████████████                                                                                  </tspan></text>
  <text></text>
  <text class="cls-1" transform="translate(-100.01 -416.88) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="9.11" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="18.23" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="27.34" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="36.45" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="45.56" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="54.68" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="63.79" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="72.9" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="82.01" xml:space="preserve">                                                   ▒                                                               </tspan><tspan x="0" y="91.13" xml:space="preserve">                                                   ▒▒                                                              </tspan><tspan x="0" y="100.24" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="109.35" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="118.47" xml:space="preserve">                                                     ▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="127.58" xml:space="preserve">                                                ▒▒▒▒      ▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="136.69" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒ ▒▒▒▒   ▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="145.8" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒░                                           </tspan><tspan x="0" y="154.92" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="164.03" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒                                         </tspan><tspan x="0" y="173.14" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒                                         </tspan><tspan x="0" y="182.25" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒                                        </tspan><tspan x="0" y="191.37" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                        </tspan><tspan x="0" y="200.48" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="209.59" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="218.71" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="227.82" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ░▒▒▒▒                                       </tspan><tspan x="0" y="236.93" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="246.04" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="255.16" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="264.27" xml:space="preserve">                                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="273.38" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="282.5" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="291.61" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="300.72" xml:space="preserve">                                              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="309.83" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                              </tspan><tspan x="0" y="318.95" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="328.06" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                </tspan><tspan x="0" y="337.17" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="346.28" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                    </tspan><tspan x="0" y="355.4" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒                                                      </tspan><tspan x="0" y="364.51" xml:space="preserve">                                                 ▒▒▒▒▒▒▒▒▒▒                                                        </tspan><tspan x="0" y="373.62" xml:space="preserve">                                                  ▒▒▒▒▒▒                                                           </tspan><tspan x="0" y="382.74" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="391.85" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="400.96" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="410.07" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="419.19" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="428.3" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="437.41" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="446.52" xml:space="preserve">                                                                                                                   </tspan></text>
</svg>`,
    telecom: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 350">
  <defs>
    <style>
      .cls-1 {
        font-size: 7.59px;
      }

      .cls-1, .cls-2 {
        fill: #f9f7d4;
        font-family: CascadiaMonoRoman-Light, 'Cascadia Mono';
        font-variation-settings: 'wght' 300;
        font-weight: 300;
      }

      .cls-2 {
        font-size: 3.83px;
      }
    </style>
  </defs>
  <text></text>
  <text class="cls-2" transform="translate(28.88 33.24) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                               █████████████████████                                               </tspan><tspan x="0" y="4.59" xml:space="preserve">                                        ███████████████████████████████████                                        </tspan><tspan x="0" y="9.19" xml:space="preserve">                                   █████████████████████████████████████████████                                   </tspan><tspan x="0" y="13.79" xml:space="preserve">                               ███████████████                       ███████████████                               </tspan><tspan x="0" y="18.38" xml:space="preserve">                            ████████████                                   ████████████                            </tspan><tspan x="0" y="22.98" xml:space="preserve">                         ███████████                                            ██████████                         </tspan><tspan x="0" y="27.57" xml:space="preserve">                       █████████            ██                                     ██████████                      </tspan><tspan x="0" y="32.17" xml:space="preserve">                    █████████              █████         █                            █████████                    </tspan><tspan x="0" y="36.76" xml:space="preserve">                  ████████                 ███████      █████                            ████████                  </tspan><tspan x="0" y="41.36" xml:space="preserve">                ████████                  ███  █████    ██████                             ████████                </tspan><tspan x="0" y="45.95" xml:space="preserve">               ███████                   ███      ███  █████████                             ███████               </tspan><tspan x="0" y="50.55" xml:space="preserve">             ███████                     ███  █     █████████████                              ███████             </tspan><tspan x="0" y="55.15" xml:space="preserve">            ██████                      ████  ███    ██████████████                              ██████            </tspan><tspan x="0" y="59.74" xml:space="preserve">          ███████                       ███  ██████    █████████████                              ███████          </tspan><tspan x="0" y="64.34" xml:space="preserve">         ███████                       ████  ███████    █████████████                               ██████         </tspan><tspan x="0" y="68.93" xml:space="preserve">        ██████                         ████  ██████       ██   ███████                               ██████        </tspan><tspan x="0" y="73.53" xml:space="preserve">       ██████                   ███████████  ███████       ██       ███                               ██████       </tspan><tspan x="0" y="78.12" xml:space="preserve">      ██████               ████████████████  ██████                    ██                              ██████      </tspan><tspan x="0" y="82.72" xml:space="preserve">     ██████                     ███████████   ███ █████                  ███                            ██████     </tspan><tspan x="0" y="87.31" xml:space="preserve">    ██████                     ████████████      ██████                     ██                           ██████    </tspan><tspan x="0" y="91.91" xml:space="preserve">    █████                   ████████████████    ██████                        ██                          █████    </tspan><tspan x="0" y="96.5" xml:space="preserve">   ██████             ███████████████   ████    ████                           ███                         █████   </tspan><tspan x="0" y="101.1" xml:space="preserve">  ██████        ███████████████████      █████              ███ █████       ██   ███                       ██████  </tspan><tspan x="0" y="105.7" xml:space="preserve">  █████            ███████████████         █████               ███████        ██  ███                       █████  </tspan><tspan x="0" y="110.29" xml:space="preserve"> ██████                █████████                                     ████      ██  ██                       ██████ </tspan><tspan x="0" y="114.89" xml:space="preserve"> █████               █████████████                             ████████▓█████  ███ ███                       █████ </tspan><tspan x="0" y="119.48" xml:space="preserve"> █████            ██████████████        █████           ██████████   ██▒▒▒▒▒▓█     ███                       █████ </tspan><tspan x="0" y="124.08" xml:space="preserve">██████          ██████ ███████  █████████         ███████████████████ ██▓▒▒████     ███                      ██████</tspan><tspan x="0" y="128.67" xml:space="preserve">█████                ████████     █████████████       █          ██████      ████     ████                    █████</tspan><tspan x="0" y="133.27" xml:space="preserve">█████               ███████           ███        ████              █████████     ██     ████                  █████</tspan><tspan x="0" y="137.86" xml:space="preserve">█████              ███████         ███    ████████      ████████          ██████           ████               █████</tspan><tspan x="0" y="142.46" xml:space="preserve">█████             ██████         ███████████        ██████████                   ██          ████             █████</tspan><tspan x="0" y="147.05" xml:space="preserve">█████             █████        ████              █████████                                      ████████      █████</tspan><tspan x="0" y="151.65" xml:space="preserve">█████            █████   ████████         ██   ████████                                         █████████     █████</tspan><tspan x="0" y="156.25" xml:space="preserve">█████           █████████████████       ███     █████                                           █████████     █████</tspan><tspan x="0" y="160.84" xml:space="preserve">██████         █████████████████      ████     ████                                               ██████     ██████</tspan><tspan x="0" y="165.44" xml:space="preserve"> █████        ████████     █████     ███      ███ ████                                             ██        █████ </tspan><tspan x="0" y="170.03" xml:space="preserve"> █████       ███          ██████    ██       ███████                                             ███         █████ </tspan><tspan x="0" y="174.63" xml:space="preserve"> ██████                   █████   ███        ████      ███         ███████████████             ██           ██████ </tspan><tspan x="0" y="179.22" xml:space="preserve">  █████                   ██████ ███        █    █████          ████              █████     ███             █████  </tspan><tspan x="0" y="183.82" xml:space="preserve">  ██████                  ██████████           ████          ██████                    █████               ██████  </tspan><tspan x="0" y="188.41" xml:space="preserve">   ██████                  ████████              █         ██████                                          █████   </tspan><tspan x="0" y="193.01" xml:space="preserve">    █████                  ████████           ███         ███████                                         █████    </tspan><tspan x="0" y="197.61" xml:space="preserve">    ██████                  ██████           ████       ████████                                         ██████    </tspan><tspan x="0" y="202.2" xml:space="preserve">     ██████                 ██████          ████       █████████                                        ██████     </tspan><tspan x="0" y="206.8" xml:space="preserve">      ██████                 █████         █████     ██████████                                        ██████      </tspan><tspan x="0" y="211.39" xml:space="preserve">       ██████                 ███          █████    ████████ ██                                       ██████       </tspan><tspan x="0" y="215.99" xml:space="preserve">        ██████                 ██          █████   ████████  ██                                      ██████        </tspan><tspan x="0" y="220.58" xml:space="preserve">         ██████                 █          █████  ████ ████   █                                     ██████         </tspan><tspan x="0" y="225.18" xml:space="preserve">          ███████                          ██████████   ██                                        ███████          </tspan><tspan x="0" y="229.77" xml:space="preserve">            ██████                          ████████     █                                       ███████           </tspan><tspan x="0" y="234.37" xml:space="preserve">             ███████                         ███████                                           ███████             </tspan><tspan x="0" y="238.96" xml:space="preserve">               ███████                       ███████                                         ███████               </tspan><tspan x="0" y="243.56" xml:space="preserve">                ████████                       █████                                       ████████                </tspan><tspan x="0" y="248.16" xml:space="preserve">                  ████████                      ████                                     ████████                  </tspan><tspan x="0" y="252.75" xml:space="preserve">                    █████████                     ███                                 █████████                    </tspan><tspan x="0" y="257.35" xml:space="preserve">                      ██████████                    ██                             ██████████                      </tspan><tspan x="0" y="261.94" xml:space="preserve">                         ██████████                                             ██████████                         </tspan><tspan x="0" y="266.54" xml:space="preserve">                            ████████████                                   ████████████                            </tspan><tspan x="0" y="271.13" xml:space="preserve">                               ███████████████                        ██████████████                               </tspan><tspan x="0" y="275.73" xml:space="preserve">                                   █████████████████████████████████████████████                                   </tspan><tspan x="0" y="280.32" xml:space="preserve">                                        ███████████████████████████████████                                        </tspan><tspan x="0" y="284.92" xml:space="preserve">                                              ███████████████████████                                              </tspan></text>
  <text></text>
  <text class="cls-1" transform="translate(-440.01 -416.88) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="9.11" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="18.23" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="27.34" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="36.45" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="45.56" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="54.68" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="63.79" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="72.9" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="82.01" xml:space="preserve">                                                   ▒                                                               </tspan><tspan x="0" y="91.13" xml:space="preserve">                                                   ▒▒                                                              </tspan><tspan x="0" y="100.24" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="109.35" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="118.47" xml:space="preserve">                                                     ▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="127.58" xml:space="preserve">                                                ▒▒▒▒      ▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="136.69" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒ ▒▒▒▒   ▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="145.8" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒░                                           </tspan><tspan x="0" y="154.92" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="164.03" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒                                         </tspan><tspan x="0" y="173.14" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒                                         </tspan><tspan x="0" y="182.25" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒                                        </tspan><tspan x="0" y="191.37" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                        </tspan><tspan x="0" y="200.48" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="209.59" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="218.71" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="227.82" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ░▒▒▒▒                                       </tspan><tspan x="0" y="236.93" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="246.04" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="255.16" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="264.27" xml:space="preserve">                                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="273.38" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="282.5" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="291.61" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="300.72" xml:space="preserve">                                              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="309.83" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                              </tspan><tspan x="0" y="318.95" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="328.06" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                </tspan><tspan x="0" y="337.17" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="346.28" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                    </tspan><tspan x="0" y="355.4" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒                                                      </tspan><tspan x="0" y="364.51" xml:space="preserve">                                                 ▒▒▒▒▒▒▒▒▒▒                                                        </tspan><tspan x="0" y="373.62" xml:space="preserve">                                                  ▒▒▒▒▒▒                                                           </tspan><tspan x="0" y="382.74" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="391.85" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="400.96" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="410.07" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="419.19" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="428.3" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="437.41" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="446.52" xml:space="preserve">                                                                                                                   </tspan></text>
</svg>`,
    wine: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 703.12 851.16">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMono-Regular, 'Cascadia Mono';
        font-size: 12px;
        font-variation-settings: 'wght' 400;
      }
    </style>
  </defs>
  <g id="Capa_1-2" data-name="Capa 1">
    <text class="cls-1"><tspan x="0" y="38.96" xml:space="preserve">                            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                            </tspan><tspan x="0" y="53.36" xml:space="preserve">                            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                            </tspan><tspan x="0" y="67.76" xml:space="preserve">                           @@@@*                                    *@@@@                           </tspan><tspan x="0" y="82.16" xml:space="preserve">                           @@@@                                      @@@@                           </tspan><tspan x="0" y="96.56" xml:space="preserve">                           @@@@                                      @@@@                           </tspan><tspan x="0" y="110.96" xml:space="preserve">                          @@@@*                                      *@@@@                          </tspan><tspan x="0" y="125.36" xml:space="preserve">                          @@@@                                        @@@@                          </tspan><tspan x="0" y="139.76" xml:space="preserve">                          @@@@                                        @@@@                          </tspan><tspan x="0" y="154.16" xml:space="preserve">                          @@@@                                        @@@@@                         </tspan><tspan x="0" y="168.56" xml:space="preserve">                         @@@@:                                        :@@@@                         </tspan><tspan x="0" y="182.96" xml:space="preserve">                         @@@@                                          @@@@                         </tspan><tspan x="0" y="197.36" xml:space="preserve">                         @@@@                                          @@@@                         </tspan><tspan x="0" y="211.76" xml:space="preserve">                         @@@@                                          @@@@                         </tspan><tspan x="0" y="226.16" xml:space="preserve">                        @@@@*                                          *@@@@                        </tspan><tspan x="0" y="240.56" xml:space="preserve">                        @@@@*++=:                                      :@@@@                        </tspan><tspan x="0" y="254.96" xml:space="preserve">                        @@@@@@@@@@@@@@@@@@*                       =@@@@@@@@@                        </tspan><tspan x="0" y="269.36" xml:space="preserve">                        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                        </tspan><tspan x="0" y="283.76" xml:space="preserve">                        @@@@************%@@@@@@@@@@@@@@@@@@@@@@@@@@@#***@@@@                        </tspan><tspan x="0" y="298.16" xml:space="preserve">                        @@@@***********************#%%@@@%%#************@@@@                        </tspan><tspan x="0" y="312.56" xml:space="preserve">                        @@@@#******************************************#@@@@                        </tspan><tspan x="0" y="326.96" xml:space="preserve">                        @@@@#******************************************#@@@@                        </tspan><tspan x="0" y="341.36" xml:space="preserve">                        @@@@##****************************************##@@@@                        </tspan><tspan x="0" y="355.76" xml:space="preserve">                        @@@@###**************************************###@@@@                        </tspan><tspan x="0" y="370.16" xml:space="preserve">                        @@@@@###************************************###@@@@@                        </tspan><tspan x="0" y="384.56" xml:space="preserve">                         @@@@#####********************************#####@@@@                         </tspan><tspan x="0" y="398.96" xml:space="preserve">                         @@@@@######****************************######@@@@@                         </tspan><tspan x="0" y="413.36" xml:space="preserve">                          @@@@@########***********************#######@@@@@                          </tspan><tspan x="0" y="427.76" xml:space="preserve">                           @@@@@##########****************##########@@@@@                           </tspan><tspan x="0" y="442.16" xml:space="preserve">                            @@@@@###########************###########@@@@@                            </tspan><tspan x="0" y="456.56" xml:space="preserve">                             @@@@@@############******############@@@@@@                             </tspan><tspan x="0" y="470.96" xml:space="preserve">                               @@@@@@%##########****##########%@@@@@@                               </tspan><tspan x="0" y="485.36" xml:space="preserve">                                 @@@@@@@@##################@@@@@@@@                                 </tspan><tspan x="0" y="499.76" xml:space="preserve">                                    @@@@@@@@############@@@@@@@@                                    </tspan><tspan x="0" y="514.16" xml:space="preserve">                                       @@@@@@@########@@@@@@@                                       </tspan><tspan x="0" y="528.56" xml:space="preserve">                                          @@@@@@####@@@@@@                                          </tspan><tspan x="0" y="542.96" xml:space="preserve">                                            @@@@@##@@@@@                                            </tspan><tspan x="0" y="557.36" xml:space="preserve">                                              @@@@@@@@                                              </tspan><tspan x="0" y="571.76" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="586.16" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="600.56" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="614.96" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="629.36" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="643.76" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="658.16" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="672.56" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="686.96" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="701.36" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="715.76" xml:space="preserve">                                                @@@@                                                </tspan><tspan x="0" y="730.16" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="744.56" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="758.96" xml:space="preserve">                                             @@@@@@@@@@                                             </tspan><tspan x="0" y="773.36" xml:space="preserve">                                           @@@@@@**@@@@@@                                           </tspan><tspan x="0" y="787.76" xml:space="preserve">                                      @@@@@@@@@******@@@@@@@@@                                      </tspan><tspan x="0" y="802.16" xml:space="preserve">                                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                </tspan><tspan x="0" y="816.56" xml:space="preserve">                                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                </tspan></text>
  </g>
</svg>`,
    web: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597.52 723.33">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMono-Regular, 'Cascadia Mono';
        font-size: 10.2px;
        font-variation-settings: 'wght' 400;
      }
    </style>
  </defs>
  <g id="Capa_1-2" data-name="Capa 1">
    <text class="cls-1"><tspan x="0" y="33.11" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="45.35" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="57.58" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="69.82" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="82.06" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="94.3" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="106.53" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="118.77" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="131.01" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="143.25" xml:space="preserve">                                                @@@@@                                               </tspan><tspan x="0" y="155.48" xml:space="preserve">                                           @@@@@@@@@@@@@@@                                          </tspan><tspan x="0" y="167.72" xml:space="preserve">                                      @@@@@@@@@@@@@@@@@@@@@@@@                                      </tspan><tspan x="0" y="179.96" xml:space="preserve">                                  @@@@@@@@@@@@@      @@@@@@@@@@@@@@                                 </tspan><tspan x="0" y="192.19" xml:space="preserve">                             @@@@@@@@@@@@@                @@@@@@@@@@@@@                             </tspan><tspan x="0" y="204.43" xml:space="preserve">                         @@@@@@@@@@@@@                        @@@@@@@@@@@@@@                        </tspan><tspan x="0" y="216.67" xml:space="preserve">                    @@@@@@@@@@@@@                                  @@@@@@@@@@@@@                    </tspan><tspan x="0" y="228.91" xml:space="preserve">                 @@@@@@@@@@@                                            @@@@@@@@@@@                 </tspan><tspan x="0" y="241.14" xml:space="preserve">                @@@@@@@@@@@                                              @@@@@@@@@@@                </tspan><tspan x="0" y="253.38" xml:space="preserve">                @@@@@@@@@@@@@@@                                      @@@@@@@@@@@@@@@                </tspan><tspan x="0" y="265.62" xml:space="preserve">                @@@@@  @@@@@@@@@@@@@                            @@@@@@@@@@@@@  @@@@@                </tspan><tspan x="0" y="277.86" xml:space="preserve">                @@@@@      @@@@@@@@@@@@@@                  @@@@@@@@@@@@@@      @@@@@                </tspan><tspan x="0" y="290.09" xml:space="preserve">                @@@@@           @@@@@@@@@@@@@          @@@@@@@@@@@@@           @@@@@                </tspan><tspan x="0" y="302.33" xml:space="preserve">                @@@@@               @@@@@@@@@@@@@  @@@@@@@@@@@@@               @@@@@                </tspan><tspan x="0" y="314.57" xml:space="preserve">                @@@@@                    @@@@@@@@@@@@@@@@@@                    @@@@@                </tspan><tspan x="0" y="326.81" xml:space="preserve">                @@@@@                        @@@@@@@@@@                        @@@@@                </tspan><tspan x="0" y="339.04" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="351.28" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="363.52" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="375.75" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="387.99" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="400.23" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="412.47" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="424.7" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="436.94" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="449.18" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="461.42" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="473.65" xml:space="preserve">                @@@@@                           @@@@                           @@@@@                </tspan><tspan x="0" y="485.89" xml:space="preserve">                @@@@@@@@                        @@@@                        @@@@@@@@                </tspan><tspan x="0" y="498.13" xml:space="preserve">                 @@@@@@@@@@@                    @@@@                    @@@@@@@@@@@                 </tspan><tspan x="0" y="510.37" xml:space="preserve">                    @@@@@@@@@@@@@               @@@@               @@@@@@@@@@@@@                    </tspan><tspan x="0" y="522.6" xml:space="preserve">                        @@@@@@@@@@@@@@          @@@@          @@@@@@@@@@@@@@                        </tspan><tspan x="0" y="534.84" xml:space="preserve">                             @@@@@@@@@@@@@      @@@@      @@@@@@@@@@@@@                             </tspan><tspan x="0" y="547.08" xml:space="preserve">                                 @@@@@@@@@@@@@@ @@@@ @@@@@@@@@@@@@@                                 </tspan><tspan x="0" y="559.31" xml:space="preserve">                                      @@@@@@@@@@@@@@@@@@@@@@@@                                      </tspan><tspan x="0" y="571.55" xml:space="preserve">                                          @@@@@@@@@@@@@@@@                                          </tspan><tspan x="0" y="583.79" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="596.03" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="608.26" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="620.5" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="632.74" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="644.98" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="657.21" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="669.45" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="681.69" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="693.93" xml:space="preserve">                                                                                                    </tspan></text>
  </g>
</svg>`,
    medical: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597.52 723.33">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMono-Regular, 'Cascadia Mono';
        font-size: 10.2px;
        font-variation-settings: 'wght' 400;
      }
    </style>
  </defs>
  <g id="Capa_1-2" data-name="Capa 1">
    <text class="cls-1"><tspan x="0" y="33.11" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="45.35" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="57.58" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="69.82" xml:space="preserve">                    @@@@@@@@@@@@@@@@@@@                      @@@@@@@@@@@@@@@@@@@                    </tspan><tspan x="0" y="82.06" xml:space="preserve">                @@@@@@@@@@@@@@@@@@@@@@@@@@@              @@@@@@@@@@@@@@@@@@@@@@@@@@@                </tspan><tspan x="0" y="94.3" xml:space="preserve">             @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@             </tspan><tspan x="0" y="106.53" xml:space="preserve">          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          </tspan><tspan x="0" y="118.77" xml:space="preserve">        @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@        </tspan><tspan x="0" y="131.01" xml:space="preserve">       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@       </tspan><tspan x="0" y="143.25" xml:space="preserve">     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     </tspan><tspan x="0" y="155.48" xml:space="preserve">    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    </tspan><tspan x="0" y="167.72" xml:space="preserve">   @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   </tspan><tspan x="0" y="179.96" xml:space="preserve">  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  </tspan><tspan x="0" y="192.19" xml:space="preserve">  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  </tspan><tspan x="0" y="204.43" xml:space="preserve"> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ </tspan><tspan x="0" y="216.67" xml:space="preserve"> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ </tspan><tspan x="0" y="228.91">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="241.14" xml:space="preserve">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="253.38" xml:space="preserve">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="265.62" xml:space="preserve">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="277.86" xml:space="preserve">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="290.09" xml:space="preserve">@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@</tspan><tspan x="0" y="302.33" xml:space="preserve"> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@      @@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ </tspan><tspan x="0" y="314.57" xml:space="preserve"> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@@@@@@@@@@@@@      @@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ </tspan><tspan x="0" y="326.81" xml:space="preserve">  @@@@@@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@      @@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  </tspan><tspan x="0" y="339.04" xml:space="preserve">   @@@@@@@@@@@@@@@@@@@@@@@@@@        @@@@@@@@@@@      @@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@   </tspan><tspan x="0" y="351.28" xml:space="preserve">    @@@@@@@@@@@@@@@@@@@@@@@@          @@@@@@@@@       @@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@    </tspan><tspan x="0" y="363.52" xml:space="preserve">     @@@@@@@@@@@@@@@@@@@@@@            @@@@@@@@      @@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@     </tspan><tspan x="0" y="375.75" xml:space="preserve">                                @@      @@@@@@      @@@@@@@@@@@@@                                   </tspan><tspan x="0" y="387.99" xml:space="preserve">                               @@@@      @@@@      @@@@@@@@@@@@@@@                                  </tspan><tspan x="0" y="400.23" xml:space="preserve">                              @@@@@@       @      @@@@@@@@@@@@@@@@@                                 </tspan><tspan x="0" y="412.47" xml:space="preserve">          @@@@@@@@@@@@@@@@@@@@@@@@@@@            @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           </tspan><tspan x="0" y="424.7" xml:space="preserve">            @@@@@@@@@@@@@@@@@@@@@@@@@@          @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@            </tspan><tspan x="0" y="436.94" xml:space="preserve">              @@@@@@@@@@@@@@@@@@@@@@@@@         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@              </tspan><tspan x="0" y="449.18" xml:space="preserve">                @@@@@@@@@@@@@@@@@@@@@@@@@      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                </tspan><tspan x="0" y="461.42" xml:space="preserve">                  @@@@@@@@@@@@@@@@@@@@@@@@    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                  </tspan><tspan x="0" y="473.65" xml:space="preserve">                    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                    </tspan><tspan x="0" y="485.89" xml:space="preserve">                     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                     </tspan><tspan x="0" y="498.13" xml:space="preserve">                       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                       </tspan><tspan x="0" y="510.37" xml:space="preserve">                         @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                         </tspan><tspan x="0" y="522.6" xml:space="preserve">                           @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                           </tspan><tspan x="0" y="534.84" xml:space="preserve">                             @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                             </tspan><tspan x="0" y="547.08" xml:space="preserve">                               @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                               </tspan><tspan x="0" y="559.31" xml:space="preserve">                                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                </tspan><tspan x="0" y="571.55" xml:space="preserve">                                  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                                  </tspan><tspan x="0" y="583.79" xml:space="preserve">                                    @@@@@@@@@@@@@@@@@@@@@@@@@@@@                                    </tspan><tspan x="0" y="596.03" xml:space="preserve">                                      @@@@@@@@@@@@@@@@@@@@@@@@                                      </tspan><tspan x="0" y="608.26" xml:space="preserve">                                        @@@@@@@@@@@@@@@@@@@@                                        </tspan><tspan x="0" y="620.5" xml:space="preserve">                                          @@@@@@@@@@@@@@@@                                          </tspan><tspan x="0" y="632.74" xml:space="preserve">                                           @@@@@@@@@@@@@@                                           </tspan><tspan x="0" y="644.98" xml:space="preserve">                                             @@@@@@@@@@                                             </tspan><tspan x="0" y="657.21" xml:space="preserve">                                               @@@@@@                                               </tspan><tspan x="0" y="669.45" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="681.69" xml:space="preserve">                                                                                                    </tspan><tspan x="0" y="693.93" xml:space="preserve">                                                                                                    </tspan></text>
  </g>
</svg>`,
    pollo: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 546.94 583.68">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMono-Regular, 'Cascadia Mono';
        font-size: 9.33px;
        font-variation-settings: 'wght' 400;
      }
    </style>
  </defs>
  <g id="Capa_1-2" data-name="Capa 1">
    <text class="cls-1"><tspan x="0" y="30.31" xml:space="preserve">                                                   ************                                     </tspan><tspan x="0" y="41.51" xml:space="preserve">                                                 ****************                                   </tspan><tspan x="0" y="52.71" xml:space="preserve">                                                *******************                                 </tspan><tspan x="0" y="63.91" xml:space="preserve">                                               ****    ***  *    **                                 </tspan><tspan x="0" y="75.11" xml:space="preserve">                                               ****...  ***  *  ****                                </tspan><tspan x="0" y="86.31" xml:space="preserve">                                               ****    +****   *****                                </tspan><tspan x="0" y="97.51" xml:space="preserve">                                               ****   ******* ******                                </tspan><tspan x="0" y="108.71" xml:space="preserve">                                               **************+******                                </tspan><tspan x="0" y="119.92" xml:space="preserve">                                    *******************************************                     </tspan><tspan x="0" y="131.12" xml:space="preserve">                                   *********************************************                    </tspan><tspan x="0" y="142.32" xml:space="preserve">                                    *******************************************                     </tspan><tspan x="0" y="153.52" xml:space="preserve">                                               @::::::::::::::::@@                                  </tspan><tspan x="0" y="164.72" xml:space="preserve">                                             @@@::::::::::::::::::@                                 </tspan><tspan x="0" y="175.92" xml:space="preserve">                                         @@@@@@::::::::::::::::::::@                                </tspan><tspan x="0" y="187.12" xml:space="preserve">                                       @@@@@@@@::::::::::@:::::::::@                  @@@@          </tspan><tspan x="0" y="198.33" xml:space="preserve">    @@                                  @@@@@@-:::::::::::@@::@@:::@@                @@   @@        </tspan><tspan x="0" y="209.53" xml:space="preserve"> @@:::::-@@                          @@@@@@@@@:::::::::::::::::::::::::@@@@         @@     @@       </tspan><tspan x="0" y="220.73" xml:space="preserve">@:@@::::::::@@                             @@@@::::::::::::::::::::::::@@@         @@       @       </tspan><tspan x="0" y="231.93" xml:space="preserve">@::::@@::::::::@@@                            @:::::::::::::::::::@@@@            @@       @        </tspan><tspan x="0" y="243.13" xml:space="preserve">@@:::::%@#:::::::::@@@                        @*::::::::::::::::::-@             @@     @           </tspan><tspan x="0" y="254.33" xml:space="preserve"> @@:::::::@@::::::::::::@@@@@                  @:::::::::::::::::::::%@@@@  @@@@@@@@                </tspan><tspan x="0" y="265.53" xml:space="preserve">   @:::::::::@@@::::::::::::::::::::::::::::::@@@::::::::::::::::::::::::::::::@@:::@@              </tspan><tspan x="0" y="276.73" xml:space="preserve">     @:::::::::::@@@@::::::::::::::::::::::::::::@::::::::::::::::::::::::::::@@::::::@@@           </tspan><tspan x="0" y="287.94" xml:space="preserve">      @@+::::::::::::::-@@@@@::::::::::::::::::@=::::::::::::::::::::::::::::@@::::::::::@@@@@      </tspan><tspan x="0" y="299.14" xml:space="preserve">        @@@::::::::::::::::::::::::::::::::::@@:::::::::::::::::::::::::::::@@::::::::::::::::::#@@@</tspan><tspan x="0" y="310.34" xml:space="preserve">           @@::::::::::::::::::::::::::::::@@::::::::::::::::::::::::::::::@@:::::::::::::::::::=@  </tspan><tspan x="0" y="321.54" xml:space="preserve">            @@@-:::::::::::::::::::::::::@#::::::::::::::::::::::::::@@@%:@%::::::::::::::::::@     </tspan><tspan x="0" y="332.74" xml:space="preserve">          @@::::@@@:::::::::::::::::::@@::::::::::::::::::::::::::::@    @@@@@%:::::::::#@@@        </tspan><tspan x="0" y="343.94" xml:space="preserve">         @%::::::::::#@@:::::::::::=@#:::::::::::::::::::::::::::::@@   @                           </tspan><tspan x="0" y="355.14" xml:space="preserve">        @@::::::::::::::::::::::@@*:::::::::::::::::::::::::::::::+@   @@                           </tspan><tspan x="0" y="366.34" xml:space="preserve">         @@::::::::::::::::::@@:::::@@@::::::::::::::::::::::::::@@   @@                            </tspan><tspan x="0" y="377.55" xml:space="preserve">          @@@::::::::::::::::::::@@:::::@@::::::::::::::::::::::@@   @@                             </tspan><tspan x="0" y="388.75" xml:space="preserve">             @@@:::::::::::::::@-::::::::::@::::::::::::::::::@@    @@                              </tspan><tspan x="0" y="399.95" xml:space="preserve">                @@@@:::::::::@#:::::::::::::@::::::::::::::@@@      @                               </tspan><tspan x="0" y="411.15" xml:space="preserve">                    @@@@=:::@::::::::::::::::@:::::::::::@@        @                                </tspan><tspan x="0" y="422.35" xml:space="preserve">                        @@@@::::::::::::::::::@:::::::::::@       @                                 </tspan><tspan x="0" y="433.55" xml:space="preserve">                          @::::::::::::::::::::@::::::::::@@     @                                  </tspan><tspan x="0" y="444.75" xml:space="preserve">                          @@-:::::::::::::::::+@=::::::::::@    @                                   </tspan><tspan x="0" y="455.96" xml:space="preserve">                            @@:::::::::::::*@@@@ @%::::::::@   @                                    </tspan><tspan x="0" y="467.16" xml:space="preserve">                              @@@:::::::@@@@      @@:::::::@  @                                     </tspan><tspan x="0" y="478.36" xml:space="preserve">                                  @@@@@@           @+::::::@  @@                                    </tspan><tspan x="0" y="489.56" xml:space="preserve">                                  @::::@            @::::::=@   @@                                  </tspan><tspan x="0" y="500.76" xml:space="preserve">                                  @:::::@          @#:::::::@@    @                                 </tspan><tspan x="0" y="511.96" xml:space="preserve">                                 @:::::::@        @@:::::::::%@                                     </tspan><tspan x="0" y="523.16" xml:space="preserve">                               @%::::::::@       @@#:::::::::::@@                                   </tspan><tspan x="0" y="534.36" xml:space="preserve">                            @@:::::::@:+@         @@@@@@::@@=:@@                                    </tspan><tspan x="0" y="545.57" xml:space="preserve">                           @::::@@:::@@              @@@@@@@@                                       </tspan><tspan x="0" y="556.77" xml:space="preserve">                            @@@@@@@@@                                                               </tspan></text>
  </g>
</svg>`,
    fruit: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 320 350">
  <defs>
    <style>
      .cls-1 {
        fill: none;
      }

      .cls-2 {
        fill: #f9f7d4;
        font-family: CascadiaMonoRoman-Light, 'Cascadia Mono';
        font-size: 7.59px;
        font-variation-settings: 'wght' 300;
        font-weight: 300;
      }

      .cls-3 {
        clip-path: url(#clippath-1);
      }
    </style>
    <clipPath id="clippath-1">
      <rect class="cls-1" x="259.56" y="-17.02" width="320" height="350"/>
    </clipPath>
  </defs>
  <g class="cls-3">
    <text/>
  </g>
  <text></text>
  <text class="cls-2" transform="translate(-100.01 -46.88) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="9.11" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="18.23" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="27.34" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="36.45" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="45.56" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="54.68" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="63.79" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="72.9" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="82.01" xml:space="preserve">                                                   ▒                                                               </tspan><tspan x="0" y="91.13" xml:space="preserve">                                                   ▒▒                                                              </tspan><tspan x="0" y="100.24" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="109.35" xml:space="preserve">                                                    ▒                                                              </tspan><tspan x="0" y="118.47" xml:space="preserve">                                                     ▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="127.58" xml:space="preserve">                                                ▒▒▒▒      ▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="136.69" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒ ▒▒▒▒   ▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="145.8" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒   ▒▒▒▒▒▒▒░                                           </tspan><tspan x="0" y="154.92" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="164.03" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒                                         </tspan><tspan x="0" y="173.14" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒                                         </tspan><tspan x="0" y="182.25" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒                                        </tspan><tspan x="0" y="191.37" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                        </tspan><tspan x="0" y="200.48" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="209.59" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="218.71" xml:space="preserve">                                       ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒                                       </tspan><tspan x="0" y="227.82" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ░▒▒▒▒                                       </tspan><tspan x="0" y="236.93" xml:space="preserve">                                        ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="246.04" xml:space="preserve">                                         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="255.16" xml:space="preserve">                                          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                          </tspan><tspan x="0" y="264.27" xml:space="preserve">                                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="273.38" xml:space="preserve">                                            ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                           </tspan><tspan x="0" y="282.5" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="291.61" xml:space="preserve">                                             ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                            </tspan><tspan x="0" y="300.72" xml:space="preserve">                                              ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                             </tspan><tspan x="0" y="309.83" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                              </tspan><tspan x="0" y="318.95" xml:space="preserve">                                               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                               </tspan><tspan x="0" y="328.06" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                </tspan><tspan x="0" y="337.17" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                  </tspan><tspan x="0" y="346.28" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                                    </tspan><tspan x="0" y="355.4" xml:space="preserve">                                                ▒▒▒▒▒▒▒▒▒▒▒▒▒                                                      </tspan><tspan x="0" y="364.51" xml:space="preserve">                                                 ▒▒▒▒▒▒▒▒▒▒                                                        </tspan><tspan x="0" y="373.62" xml:space="preserve">                                                  ▒▒▒▒▒▒                                                           </tspan><tspan x="0" y="382.74" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="391.85" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="400.96" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="410.07" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="419.19" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="428.3" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="437.41" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="446.52" xml:space="preserve">                                                                                                                   </tspan></text>
</svg>`,
    electric: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 350">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMonoRoman-Light, 'Cascadia Mono';
        font-size: 4.39px;
        font-variation-settings: 'wght' 300;
        font-weight: 300;
      }
    </style>
  </defs>
  <text></text>
  <text class="cls-1" transform="translate(0 12.49) scale(1.02 1)"><tspan x="0" y="0" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="5.27" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="10.54" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="15.8" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="21.07" xml:space="preserve">                                                                                            █████████              </tspan><tspan x="0" y="26.34" xml:space="preserve">                                                                          ▓████████████████████████                </tspan><tspan x="0" y="31.61" xml:space="preserve">                                                         ██████████████████████████████████░█████                  </tspan><tspan x="0" y="36.88" xml:space="preserve">                                                       ██████████████████░░░░░░░░░░░░░░░░░█████                    </tspan><tspan x="0" y="42.14" xml:space="preserve">                                                     █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                     </tspan><tspan x="0" y="47.41" xml:space="preserve">                                                    ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                       </tspan><tspan x="0" y="52.68" xml:space="preserve">                                                   ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                         </tspan><tspan x="0" y="57.95" xml:space="preserve">                                                  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                           </tspan><tspan x="0" y="63.21" xml:space="preserve">                                                █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                             </tspan><tspan x="0" y="68.48" xml:space="preserve">                                               ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                               </tspan><tspan x="0" y="73.75" xml:space="preserve">                                              ████░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                                 </tspan><tspan x="0" y="79.02" xml:space="preserve">                                            █████░░░░░░░░░░░░░░░░░░░░░░░░░░█████░                                  </tspan><tspan x="0" y="84.29" xml:space="preserve">                                           ████░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                                    </tspan><tspan x="0" y="89.55" xml:space="preserve">                                          ████░░░░░░░░░░░░░░░░░░░░░░░░░░█████                                      </tspan><tspan x="0" y="94.82" xml:space="preserve">                                        ░████░░░░░░░░░░░░░░░░░░░░░░░░░█████                                        </tspan><tspan x="0" y="100.09" xml:space="preserve">                                       █████░░░░░░░░░░░░░░░░░░░░░░░░█████                                          </tspan><tspan x="0" y="105.36" xml:space="preserve">                                      ████░░░░░░░░░░░░░░░░░░░░░░░░█████     █████▓                                 </tspan><tspan x="0" y="110.62" xml:space="preserve">                                     ████░░░░░░░░░░░░░░░░░░░░░░░████████████████                                   </tspan><tspan x="0" y="115.89" xml:space="preserve">                                   █████░░░░░░░░░░░░░░░░░░░░░░████████████████                                     </tspan><tspan x="0" y="121.16" xml:space="preserve">                                  ████░░░░░░░░░░░░░░░░░░░░░░██░░░░░░░░░░█████                                      </tspan><tspan x="0" y="126.43" xml:space="preserve">                                 ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████                                        </tspan><tspan x="0" y="131.7" xml:space="preserve">                               █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████                                         </tspan><tspan x="0" y="136.96" xml:space="preserve">                              ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████                                           </tspan><tspan x="0" y="142.23" xml:space="preserve">                             ████░░░░░░░█████████░░░░░░░░░░░░░░░░░█████                                            </tspan><tspan x="0" y="147.5" xml:space="preserve">                            ███████████████████░░░░░░░░░░░░░░░░░░████              ████                            </tspan><tspan x="0" y="152.77" xml:space="preserve">                          █████████████   ████░░░░░░░░░░░░░░░░░█████      ███████████                              </tspan><tspan x="0" y="158.04" xml:space="preserve">                         ██             █████░░░░░░░░░░░░░░░░▒████████████████████                                 </tspan><tspan x="0" y="163.3" xml:space="preserve">                                       ████░░░░░░░░░░░░░░░░░████████████████████                                   </tspan><tspan x="0" y="168.57" xml:space="preserve">                                     █████░░░░░░░░░░░░░░░░███████░░░░░░░██████                                     </tspan><tspan x="0" y="173.84" xml:space="preserve">                                    ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████                                        </tspan><tspan x="0" y="179.11" xml:space="preserve">                                   ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████                                          </tspan><tspan x="0" y="184.38" xml:space="preserve">                                 █████░░░░░░░░░░░░░░░░░░░░░░░░░░██████                                             </tspan><tspan x="0" y="189.64" xml:space="preserve">                                ████░░░░░░░████▒░░░░░░░░░░░░░░██████                                               </tspan><tspan x="0" y="194.91" xml:space="preserve">                               ███████████████░░░░░░░░░░░░░░█████                                                  </tspan><tspan x="0" y="200.18" xml:space="preserve">                             ████████████████░░░░░░░░░░░░██████                                                    </tspan><tspan x="0" y="205.45" xml:space="preserve">                            ██████     ████░░░░░░░░░░░░██████                                                      </tspan><tspan x="0" y="210.71" xml:space="preserve">                                      ████░░░░░░░░░░██████                                                         </tspan><tspan x="0" y="215.98" xml:space="preserve">                                    █████░░░░░░░░░██████                                                           </tspan><tspan x="0" y="221.25" xml:space="preserve">                                   ████░░░░░░░░██████                                                              </tspan><tspan x="0" y="226.52" xml:space="preserve">                                  ████░░░░░░░██████                                                                </tspan><tspan x="0" y="231.79" xml:space="preserve">                                █████░░░░░░█████                                                                   </tspan><tspan x="0" y="237.05" xml:space="preserve">                               ████░░░░░██████                                                                     </tspan><tspan x="0" y="242.32" xml:space="preserve">                              ████░░░░█████░                                                                       </tspan><tspan x="0" y="247.59" xml:space="preserve">                            █████░░██████                                                                          </tspan><tspan x="0" y="252.86" xml:space="preserve">                           ████░░██████                                                                            </tspan><tspan x="0" y="258.13" xml:space="preserve">                          ██████████                                                                               </tspan><tspan x="0" y="263.39" xml:space="preserve">                        ██████████                                                                                 </tspan><tspan x="0" y="268.66" xml:space="preserve">                       ████████                                                                                    </tspan><tspan x="0" y="273.93" xml:space="preserve">                      ███████                                                                                      </tspan><tspan x="0" y="279.2" xml:space="preserve">                    ██████                                                                                         </tspan><tspan x="0" y="284.47" xml:space="preserve">                   █████                                                                                           </tspan><tspan x="0" y="289.73" xml:space="preserve">                  ████                                                                                             </tspan><tspan x="0" y="295" xml:space="preserve">                ███                                                                                                </tspan><tspan x="0" y="300.27" xml:space="preserve">               ██                                                                                                  </tspan><tspan x="0" y="305.54" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="310.8" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="316.07" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="321.34" xml:space="preserve">                                                                                                                   </tspan><tspan x="0" y="326.61" xml:space="preserve">                                                                                                                   </tspan></text>
</svg>`,
    diamond: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 597.52 613.19">
  <defs>
    <style>
      .cls-1 {
        fill: #f9f7d4;
        font-family: CascadiaMono-Regular, 'Cascadia Mono';
        font-size: 10.2px;
        font-variation-settings: 'wght' 400;
      }
    </style>
  </defs>
  <g id="Capa_1-2" data-name="Capa 1">
    <text class="cls-1"><tspan x="0" y="33.11" xml:space="preserve">                     @@@@@%@@@@@@@@@@@@@@@@@%%%%%%%%%%%@@@@@@@@@@%%@@%%@@%@@@@@                     </tspan><tspan x="0" y="45.35" xml:space="preserve">                   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                   </tspan><tspan x="0" y="57.58" xml:space="preserve">                  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                  </tspan><tspan x="0" y="69.82" xml:space="preserve">                 %%%%%%            %%%%%%                 @%%%%%%            %%%%%%                 </tspan><tspan x="0" y="82.06" xml:space="preserve">               @%%%%%%            %%%%%%                    %%%%%@            %%%%%%@               </tspan><tspan x="0" y="94.3" xml:space="preserve">              %%%%%%@            @%%%%%                      %%%%%             %%%%%%%              </tspan><tspan x="0" y="106.53" xml:space="preserve">             %%%%%%              %%%%%                       %%%%%%              %%%%%%             </tspan><tspan x="0" y="118.77" xml:space="preserve">            %%%%%%              %%%%%@                        %%%%%%              %%%%%%            </tspan><tspan x="0" y="131.01" xml:space="preserve">          %%%%%%%              %%%%%%                          %%%%%%              %%%%%%%          </tspan><tspan x="0" y="143.25" xml:space="preserve">         %%%%%%@              %%%%%%                            %%%%%@              @%%%%%%         </tspan><tspan x="0" y="155.48" xml:space="preserve">        %%%%%%               @%%%%%                              %%%%%                %%%%%%        </tspan><tspan x="0" y="167.72" xml:space="preserve">       %%%%%%                %%%%%                               %%%%%%                %%%%%%       </tspan><tspan x="0" y="179.96" xml:space="preserve">     %%%%%%%                %%%%%%                                %%%%%%                %%%%%%%     </tspan><tspan x="0" y="192.19" xml:space="preserve">    %%%%%%%                %%%%%%                                  %%%%%%                @%%%%%%    </tspan><tspan x="0" y="204.43" xml:space="preserve">   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%   </tspan><tspan x="0" y="216.67" xml:space="preserve">  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  </tspan><tspan x="0" y="228.91" xml:space="preserve">  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  </tspan><tspan x="0" y="241.14" xml:space="preserve">    %%%%%%%                %%%%%%                                  %%%%%%                %%%%%%%    </tspan><tspan x="0" y="253.38" xml:space="preserve">     @%%%%%%%               %%%%%@                                %%%%%%               %%%%%%%@     </tspan><tspan x="0" y="265.62" xml:space="preserve">       %%%%%%%               %%%%%                               @%%%%%               %%%%%%%       </tspan><tspan x="0" y="277.86" xml:space="preserve">         %%%%%%%             %%%%%%                              %%%%%              %%%%%%%         </tspan><tspan x="0" y="290.09" xml:space="preserve">          @%%%%%%%            %%%%%%                            %%%%%%            %%%%%%%@          </tspan><tspan x="0" y="302.33" xml:space="preserve">            %%%%%%%            %%%%%%                          %%%%%%            %%%%%%%            </tspan><tspan x="0" y="314.57" xml:space="preserve">              %%%%%%%           %%%%%%                        %%%%%%           %%%%%%%              </tspan><tspan x="0" y="326.81" xml:space="preserve">               %%%%%%%@         @%%%%%                       %%%%%%          %%%%%%%@               </tspan><tspan x="0" y="339.04" xml:space="preserve">                 %%%%%%%         %%%%%%                      %%%%%@         %%%%%%%                 </tspan><tspan x="0" y="351.28" xml:space="preserve">                   %%%%%%%        %%%%%%                    %%%%%%        %%%%%%%                   </tspan><tspan x="0" y="363.52" xml:space="preserve">                    @%%%%%%@       %%%%%%                  %%%%%%       %%%%%%%@                    </tspan><tspan x="0" y="375.75" xml:space="preserve">                      %%%%%%%       %%%%%                 @%%%%%       %%%%%%%                      </tspan><tspan x="0" y="387.99" xml:space="preserve">                        %%%%%%%     %%%%%%                %%%%%      %%%%%%%                        </tspan><tspan x="0" y="400.23" xml:space="preserve">                         @%%%%%%@    %%%%%%              %%%%%@    %%%%%%%@                         </tspan><tspan x="0" y="412.47" xml:space="preserve">                           %%%%%%%    %%%%%%            %%%%%%    %%%%%%%                           </tspan><tspan x="0" y="424.7" xml:space="preserve">                             %%%%%%%   %%%%%%          %%%%%%   %%%%%%%                             </tspan><tspan x="0" y="436.94" xml:space="preserve">                              @%%%%%%@  %%%%%         %%%%%%  %%%%%%%@                              </tspan><tspan x="0" y="449.18" xml:space="preserve">                                %%%%%%% %%%%%%        %%%%%  %%%%%%%                                </tspan><tspan x="0" y="461.42" xml:space="preserve">                                  %%%%%%%%%%%%%      %%%%%%%%%%%%%                                  </tspan><tspan x="0" y="473.65" xml:space="preserve">                                   @%%%%%%%%%%%%    %%%%%%%%%%%%@                                   </tspan><tspan x="0" y="485.89" xml:space="preserve">                                     %%%%%%%%%%%@  %%%%%%%%%%%%                                     </tspan><tspan x="0" y="498.13" xml:space="preserve">                                       %%%%%%%%%%  %%%%%%%%%%                                       </tspan><tspan x="0" y="510.37" xml:space="preserve">                                        %%%%%%%%%%%%%%%%%%%@                                        </tspan><tspan x="0" y="522.6" xml:space="preserve">                                          %%%%%%%%%%%%%%%%                                          </tspan><tspan x="0" y="534.84" xml:space="preserve">                                            %%%%%%%%%%%%                                            </tspan><tspan x="0" y="547.08" xml:space="preserve">                                             @%%%%%%%%@                                             </tspan><tspan x="0" y="559.31" xml:space="preserve">                                               %%%%%%                                               </tspan><tspan x="0" y="571.55" xml:space="preserve">                                                 %%                                                 </tspan><tspan x="0" y="583.79" xml:space="preserve">                                                                                                    </tspan></text>
  </g>
</svg>`
};

// Portfolio Data
const portfolioData = [
    {
        category: "Sobre Mí",
        isStatic: true,
        isDefault: true,
        asciiArt: `
     ██╗███╗   ███╗
     ██║████╗ ████║
     ██║██╔████╔██║
██   ██║██║╚██╔╝██║
╚█████╔╝██║ ╚═╝ ██║
 ╚════╝ ╚═╝     ╚═╝`,
        content: `
            <div class="about-container">
                <div class="tab-navigation">
                    <button class="tab-button active" data-tab="intro">
                        ╔═══════════╗
                        ║   INTRO   ║
                        ╚═══════════╝
                    </button>
                    <button class="tab-button" data-tab="timeline">
                        ╔═══════════╗
                        ║ TIMELINE  ║
                        ╚═══════════╝
                    </button>
                    <button class="tab-button" data-tab="skills">
                        ╔═══════════╗
                        ║  SKILLS   ║
                        ╚═══════════╝
                    </button>
                    <button class="tab-button" data-tab="proceso">
                        ╔═══════════╗
                        ║  PROCESO  ║
                        ╚═══════════╝
                    </button>
                </div>
                
                <div class="tab-content active" id="intro">
                    <h2>HOLA, SOY JULIO</h2>
                    <p>Diseñador enfocado en crear sistemas visuales que <span class="highlight">funcionan</span> y <span class="highlight">comunican</span> efectivamente.</p>
                    <p>Mi trabajo se centra en entender el problema antes de diseñar la solución. No se trata solo de hacer algo bonito, sino de crear algo que resuelva necesidades reales y genere resultados tangibles.</p>
                    <p>Creo firmemente en el poder del diseño como herramienta de transformación empresarial, donde cada decisión visual tiene un propósito claro y medible.</p>
                </div>
                
                <div class="tab-content" id="timeline">
                    <h2>MI TRAYECTORIA</h2>
                    <div class="timeline-container">
                        <div class="timeline-line"></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2017</div><div class="timeline-title">Inicios como Diseñador</div><div class="timeline-description">Comencé vendiendo camisetas personalizadas con diseños propios en Facebook, explorando mi pasión por el diseño.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2018</div><div class="timeline-title">Pemol Sports - Diseñador Jr</div><div class="timeline-description">Mi primera experiencia profesional, donde aprendí sobre procesos de diseño y trabajo en equipo.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2019</div><div class="timeline-title">Inicio como Freelancer</div><div class="timeline-description">Con experiencia sólida, emprendí mi propio camino ofreciendo servicios de diseño independiente.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2020</div><div class="timeline-title">Pandemia Mundial</div><div class="timeline-description">Tiempo de reflexión y práctica intensiva. Perfeccioné mis habilidades y exploré nuevas áreas del diseño.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2021</div><div class="timeline-title">Tinema LLC - Proyecto Internacional</div><div class="timeline-description">Desde Miami, me contrataron para branding completo y diseño web para una empresa de criptomonedas. Todo remoto.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2022</div><div class="timeline-title">CashApp - Customer Service</div><div class="timeline-description">Mejoré mi inglés trabajando en soporte mientras continuaba con proyectos freelance.</div></div>
                        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-year">2023-2024</div><div class="timeline-title">Diamond Soft & Grandes Proyectos</div><div class="timeline-description">Trabajé en eventos internacionales como el VI Summit del Espárrago, manejé redes de empresas medianas y grandes, y realicé múltiples proyectos de branding.</div></div>
                    </div>
                </div>
                
                <div class="tab-content" id="skills">
                    <h2>HABILIDADES Y HERRAMIENTAS</h2>
                    <div class="skills-visual">
                        <canvas id="skills-radar" width="400" height="400"></canvas>
                    </div>
                    <div class="tools-section">
                        <h3>Herramientas</h3>
                        <div class="tools-list">
                            <span class="tool-tag">Adobe Creative Suite</span><span class="tool-tag">Figma</span><span class="tool-tag">Sketch</span><span class="tool-tag">After Effects</span><span class="tool-tag">WordPress</span><span class="tool-tag">HTML/CSS/JS</span>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="proceso">
                    <h2>CÓMO TRABAJO</h2>
                    <div class="process-grid">
                        <div class="process-step"><div class="process-number">01</div><div class="process-content"><h4>Escuchar y Entender</h4><p>Cada proyecto comienza con una conversación profunda. Necesito entender no solo lo que quieres, sino por qué lo necesitas.</p></div></div>
                        <div class="process-step"><div class="process-number">02</div><div class="process-content"><h4>Investigar y Conceptualizar</h4><p>Analizo tu industria, competencia y audiencia. Luego desarrollo conceptos que conecten con tus objetivos.</p></div></div>
                        <div class="process-step"><div class="process-number">03</div><div class="process-content"><h4>Diseñar con Propósito</h4><p>Cada elemento visual tiene una razón de ser. Creo soluciones que funcionan y comunican efectivamente.</p></div></div>
                        <div class="process-step"><div class="process-number">04</div><div class="process-content"><h4>Iterar y Perfeccionar</h4><p>El mejor diseño surge de la colaboración. Refino basándome en tu feedback hasta lograr la excelencia.</p></div></div>
                    </div>
                </div>
                
                <div class="contact-section">
                    <h3>Trabajemos Juntos</h3>
                    <p>Si tienes un proyecto en mente o simplemente quieres conversar sobre diseño, me encantaría escucharte.</p>
                    <div class="contact-grid">
                        <div class="contact-item"><span class="contact-label">EMAIL</span><a href="mailto:julioerty@gmail.com">julioerty@gmail.com</a></div>
                        <div class="contact-item"><span class="contact-label">TELÉFONO</span><a href="tel:+529833077150">+52 983 307 7150</a></div>
                        <div class="contact-item"><span class="contact-label">BEHANCE</span><a href="https://behance.net/juliomorcillo" target="_blank" rel="noopener noreferrer">behance.net/juliomorcillo</a></div>
                        <div class="contact-item"><span class="contact-label">LINKEDIN</span><a href="https://linkedin.com/in/juliomorcillo" target="_blank" rel="noopener noreferrer">linkedin.com/in/juliomorcillo</a></div>
                        <div class="contact-item"><span class="contact-label">UBICACIÓN</span><span>Mérida, Yucatán, México</span></div>
                    </div>
                </div>
            </div>
        `
    },
    {
        category: "Identidad de Marca",
        projects: [
            { 
                title: "VI Summit Espárrago",
                iconId: "summit",
                gallery: ["https://i.imgur.com/pzaXwLb.png", "https://i.imgur.com/87VilOg.png", "https://i.imgur.com/b6AFnfg.png", "https://i.imgur.com/Wl9CtDC.jpeg"],
                videos: [{ title: "Grabación del evento", url: "https://youtu.be/2OzDdQZfW4Q" }, { title: "Anuncio promocional", url: "https://youtu.be/x538lxuaVp8" }],
                client: "Foro Internacional del Espárrago", scope: "Internacional", año: "2025",
                skills: {"Diseño Gráfico": 35, "UI/UX": 5, "Social Media": 25, "Desarrollo Web": 5, "Copywriting": 15, "Motion Graphics": 15},
                desafio: "Crear una identidad visual memorable para un evento internacional que atrajera a productores y compradores de 15 países.",
                solution: "Colaboré en la conceptualización del logotipo y lideré el desarrollo del sistema visual completo del evento, incluyendo señalética, plantillas y merch.",
                resultado: "La identidad contribuyó a establecer el evento como referente en la industria, con asistentes de más de 15 países."
            },
            { 
                title: "AT Solutions (Rebranding)",
                iconId: "tech",
                gallery: ["https://i.imgur.com/V7mTrXE.png", "https://i.imgur.com/qnNKV3z.png", "https://i.imgur.com/SzCtABE.jpeg"],
                client: "AT Solutions (antes Amerimex)", año: "2024",
                skills: {"Diseño Gráfico": 50, "UI/UX": 10, "Social Media": 10, "Desarrollo Web": 0, "Copywriting": 20, "Motion Graphics": 10},
                desafio: "Modernizar la imagen de una empresa con 20 años en el mercado sin perder su esencia.",
                solution: "Dirigí el rediseño del logotipo y definí una nueva paleta de colores y elementos visuales para su uso en materiales digitales y corporativos.",
                resultado: "El nuevo branding facilitó la comunicación con clientes más jóvenes y mejoró la percepción de la empresa como partner tecnológico moderno."
            },
            {
                title: "Alfa Comunicaciones",
                iconId: "telecom",
                gallery: ["https://i.imgur.com/2QppxNG.png", "https://i.imgur.com/ttGX7ql.png", "https://i.imgur.com/4BGodmH.png", "https://i.imgur.com/qw9vtgh.png"],
                client: "Alfa Comunicaciones", scope: "Regional", año: "2024",
                skills: {"Diseño Gráfico": 60, "UI/UX": 5, "Social Media": 15, "Desarrollo Web": 0, "Copywriting": 15, "Motion Graphics": 5},
                desafio: "Desarrollar una identidad que comunicara innovación tecnológica y confiabilidad en el sector de telecomunicaciones.",
                solution: "Creé un sistema de identidad completo incluyendo logotipo, paleta de colores corporativos, y aplicaciones en papelería y material digital.",
                resultado: "La nueva identidad ayudó a posicionar a la empresa como una opción confiable y moderna en el mercado regional de telecomunicaciones."
            },
            {
                title: "Consentido - Estancia Vinícola",
                iconId: "wine",
                gallery: ["https://i.imgur.com/5lb9MSL.png", "https://i.imgur.com/nmfErWI.png", "https://i.imgur.com/5tqQeBL.png", "https://i.imgur.com/SPRA40X.png"],
                brandbook: "https://i.imgur.com/IrdmGBF.jpeg",
                client: "Consentido", tipo: "Estancia Vinícola", año: "2025",
                skills: {"Diseño Gráfico": 60, "UI/UX": 0, "Social Media": 20, "Desarrollo Web": 0, "Copywriting": 10, "Motion Graphics": 10},
                desafio: "Crear una identidad visual que transmitiera elegancia, tradición y el carácter artesanal de los vinos.",
                solution: "Desarrollé un sistema completo de identidad incluyendo logotipo, paleta de colores inspirada en la tierra y el vino, y un brandbook detallado.",
                resultado: "La marca logró posicionarse como referente de calidad en el mercado vinícola internacional."
            }
        ]
    },
    {
        category: "Experiencias Digitales",
        projects: [
            { 
                title: "AMXiTech.com",
                iconId: "web",
                imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/68c1e0222688219.67eb461cc1400.png",
                externalLink: "https://amxitech.com",
                client: "AMX / iTech", platform: "WordPress", año: "2024",
                skills: {"Diseño Gráfico": 10, "UI/UX": 60, "Social Media": 0, "Desarrollo Web": 20, "Copywriting": 10, "Motion Graphics": 0},
                desafio: "Diseñar una plataforma que comunicara expertise técnico de manera accesible.",
                solution: "Diseño de la interfaz de usuario y la experiencia de navegación para un proveedor de soluciones tecnológicas, enfocado en la claridad y la profesionalidad.",
                resultado: "La nueva interfaz facilitó el proceso de búsqueda de información técnica y mejoró la generación de leads cualificados."
            },
            { 
                title: "NeuromuscularMID.com",
                iconId: "medical",
                imageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/a2d34f222688275.67eb4692a7b21.png",
                externalLink: "https://neuromuscularmid.com",
                client: "Neuromuscular MID", platform: "WordPress", año: "2025",
                skills: {"Diseño Gráfico": 5, "UI/UX": 80, "Social Media": 0, "Desarrollo Web": 15, "Copywriting": 0, "Motion Graphics": 0},
                desafio: "Crear una experiencia digital que transmitiera confianza médica y fuera accesible para pacientes de todas las edades.",
                solution: "Creación de una interfaz de usuario limpia y accesible para un centro de especialidades médicas, priorizando la facilidad de uso.",
                resultado: "El sitio mejoró significativamente la experiencia de los pacientes al buscar información y agendar citas."
            },
            {
                title: "Pollos Giros",
                iconId: "pollo",
                client: "Los Pollos Giros", platform: "WordPress", año: "2024",
                skills: {"Diseño Gráfico": 20, "UI/UX": 40, "Social Media": 0, "Desarrollo Web": 40, "Copywriting": 0, "Motion Graphics": 0},
                desafio: "Establecer presencia digital para un negocio familiar sin experiencia en línea.",
                solution: "Creé un sitio web responsivo en WordPress, enfocándome en una UX simple y un diseño que reflejara la calidez de la marca familiar.",
                resultado: "El sitio aumentó la reputación del lugar, al igual que acelerar y agilizar sus pedidos realizados en web."
            }
        ]
    },
    {
        category: "Contenido Digital",
        projects: [
            { 
                title: "Estrategia Visual Corber MX",
                iconId: "fruit",
                gallery: ["https://i.imgur.com/z6sfmjh.png", "https://i.imgur.com/QR0YIl1.png", "https://i.imgur.com/TwJLShX.png", "https://i.imgur.com/XvgHfnv.png"],
                stories: ["https://i.imgur.com/OD77saD.mp4", "https://i.imgur.com/VOEUZDx.mp4"],
                client: "Corber MX (Frutas Tropicales)", año: "2024-2025",
                skills: {"Diseño Gráfico": 20, "UI/UX": 0, "Social Media": 50, "Desarrollo Web": 0, "Copywriting": 20, "Motion Graphics": 10},
                desafio: "Establecer presencia profesional en redes sociales para una empresa B2B sin identidad visual digital previa.",
                solution: "Diseñé y ejecuté una línea de contenido visual para Instagram, estableciendo una identidad visual coherente y profesional.",
                resultado: "Se logró establecer una presencia digital sólida que generó nuevas oportunidades de negocio."
            },
            {
                title: "Chint Electrics México",
                iconId: "electric",
                gallery: ["https://i.imgur.com/E9tNQpb.png", "https://i.imgur.com/ANxr0ii.png", "https://i.imgur.com/YYddDwY.png", "https://i.imgur.com/Iodnx9d.png", "https://i.imgur.com/7yDEaHb.png"],
                stories: ["https://i.imgur.com/dsY6ygx.mp4", "https://i.imgur.com/YOiGGqR.mp4"],
                client: "Chint Electrics", platform: "Instagram, LinkedIn", periodo: "2024-2025",
                skills: {"Diseño Gráfico": 25, "UI/UX": 0, "Social Media": 45, "Desarrollo Web": 0, "Copywriting": 25, "Motion Graphics": 5},
                desafio: "Posicionar a una marca china de componentes eléctricos en el mercado mexicano B2B.",
                solution: "Desarrollé una estrategia de contenido bilingüe enfocada en educación técnica y casos de éxito locales.",
                resultado: "Se logró establecer a Chint como una opción confiable en el mercado mexicano, generando leads cualificados consistentemente."
            },
            {
                title: "Diamond Soft Innovations",
                iconId: "diamond",
                gallery: ["https://i.imgur.com/BZ3Ldor.png", "https://i.imgur.com/xgmHXq2.png", "https://i.imgur.com/tiXI1GE.png", "https://i.imgur.com/32PdklD.png"],
                client: "Diamond Soft", platform: "LinkedIn, Twitter", periodo: "2024-2025",
                skills: {"Diseño Gráfico": 30, "UI/UX": 0, "Social Media": 40, "Desarrollo Web": 0, "Copywriting": 30, "Motion Graphics": 0},
                desafio: "Comunicar soluciones tecnológicas complejas de manera accesible para tomadores de decisión.",
                solution: "Creé una línea gráfica minimalista pero impactante, usando infografías y casos de estudio visuales.",
                resultado: "Se logró mejorar la comprensión de las soluciones ofrecidas y facilitar el proceso de venta."
            }
        ]
    }
];

// Main Application
class PortfolioApp {
    constructor() {
        this.soundSystem = new SoundSystem();
        this.currentCategory = 0;
        this.currentProject = 0;
        this.isTransitioning = false;
        this.currentGalleryImages = [];
        this.currentImageIndex = 0;
        
        // DOM Elements
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.portfolioLayout = document.getElementById('portfolio-layout');
        this.welcomeButton = document.getElementById('welcome-button');
        this.panelLeft = document.getElementById('panel-left');
        this.panelRight = document.getElementById('panel-right');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxMedia = document.getElementById('lightbox-media');
        this.lightboxClose = document.getElementById('lightbox-close');
        this.dynamicDisplay = document.getElementById('dynamic-display');
        this.asciiContainer = this.dynamicDisplay.querySelector('.ascii-container');
        this.svgPlaceholder = this.dynamicDisplay.querySelector('.svg-placeholder');
        this.radarCanvas = document.getElementById('radar-chart');
        this.breadcrumb = document.querySelector('.breadcrumb-current');
        
        this.init();
    }
    
    async init() {
        document.addEventListener('click', () => this.soundSystem.init(), { once: true });
        
        this.initDecryptAnimation();
        
        this.welcomeButton.addEventListener('click', () => this.startPortfolio());
        this.lightboxClose.addEventListener('click', (e) => this.closeLightbox(e));
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox(e);
        });
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        this.renderNavigation();
        this.addUiElements();
        
        setTimeout(() => this.soundSystem.play('boot'), 500);
    }
    
    initDecryptAnimation() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        document.querySelectorAll('.decrypt-text').forEach(element => {
            let iteration = 0;
            const originalText = element.dataset.value;
            let interval = null;

            const animate = () => {
                element.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    element.innerText = originalText;
                    return;
                }

                iteration += 1 / 3;
            };

            setTimeout(() => {
                interval = setInterval(animate, 30);
            }, 800);
        });
    }

    addUiElements() {
        // Mute Button
        const muteContainer = document.getElementById('mute-button-container');
        const muteButton = document.createElement('button');
        muteButton.id = 'mute-button';
        muteButton.setAttribute('aria-label', 'Silenciar sonido');
        muteButton.innerHTML = `<span class="speaker-icon"></span>`;
        muteButton.addEventListener('click', () => {
            const isMuted = this.soundSystem.toggleMute();
            muteButton.classList.toggle('muted', isMuted);
            muteButton.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar sonido');
        });
        muteContainer.appendChild(muteButton);

        // Navigation Hint
        const hintContainer = document.getElementById('nav-hint-container');
        const hint = document.createElement('div');
        hint.className = 'nav-hint';
        hint.innerHTML = 'Navegación: ↑↓ Proyectos • ← → Categorías • ESC Cerrar';
        hintContainer.appendChild(hint);
    }
    
    startPortfolio() {
        this.soundSystem.play('click');
        this.welcomeScreen.style.animation = 'fadeOut 0.5s forwards';
        
        setTimeout(() => {
            this.welcomeScreen.classList.add('hidden');
            this.portfolioLayout.classList.remove('hidden');
            
            const defaultIndex = portfolioData.findIndex(cat => cat.isDefault);
            const defaultCategory = document.querySelector(`.nav-category[data-index="${defaultIndex}"]`);
            
            if (defaultCategory) {
                this.showCategoryContent(defaultIndex, defaultCategory);
            }
            
            this.soundSystem.play('transition');
        }, 500);
    }
    
    renderNavigation() {
        this.panelLeft.innerHTML = '';
        portfolioData.forEach((data, index) => {
            const el = document.createElement('div');
            el.className = 'nav-category';
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', `Categoría: ${data.category}`);
            el.innerHTML = `<span class="prompt" aria-hidden="true">></span> <span class="category-name">${data.category}</span>`;
            el.dataset.index = index;
            
            el.addEventListener('mouseenter', () => this.soundSystem.play('hover'));
            el.addEventListener('click', () => this.handleCategoryClick(el, index));
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') this.handleCategoryClick(el, index);
            });
            
            this.panelLeft.appendChild(el);
        });
    }
    
    handleCategoryClick(el, index) {
        if (this.isTransitioning || el.classList.contains('active')) return;
        this.soundSystem.play('click');
        this.showCategoryContent(index, el);
    }
    
    updateDynamicDisplay(data, project = null) {
        this.breadcrumb.textContent = project ? `${data.category} > ${project.title}` : data.category;
    
        if (project && project.iconId && projectIcons[project.iconId]) {
            this.asciiContainer.style.display = 'none';
            this.svgPlaceholder.innerHTML = projectIcons[project.iconId];
            this.svgPlaceholder.style.display = 'flex';
        } else {
            this.svgPlaceholder.style.display = 'none';
            this.asciiContainer.style.display = 'flex';
            this.asciiContainer.innerHTML = `<pre>${data.asciiArt || ''}</pre>`;
        }
    
        const skillsToDraw = project?.skills;
        
        if (skillsToDraw) {
            this.radarCanvas.style.display = 'block';
            this.drawRadarChart(skillsToDraw);
        } else {
            this.radarCanvas.style.display = 'none';
        }
    }
    
    drawRadarChart(skills) {
        const ctx = this.radarCanvas.getContext('2d');
        const { width, height } = this.radarCanvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 30;
        
        ctx.clearRect(0, 0, width, height);
        
        const skillNames = Object.keys(skills);
        const skillValues = Object.values(skills);
        const angleStep = (Math.PI * 2) / skillNames.length;

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            const gridRadius = (radius / 5) * i;
            ctx.beginPath();
            for (let j = 0; j <= skillNames.length; j++) {
                const angle = j * angleStep - Math.PI / 2;
                const x = centerX + Math.cos(angle) * gridRadius;
                const y = centerY + Math.sin(angle) * gridRadius;
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        ctx.font = '12px VT323';
        ctx.fillStyle = '#999';
        skillNames.forEach((skill, index) => {
            const angle = index * angleStep - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            ctx.stroke();

            ctx.save();
            ctx.translate(centerX + Math.cos(angle) * (radius + 15), centerY + Math.sin(angle) * (radius + 15));
            ctx.rotate(angle + Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(skill, 0, 0);
            ctx.restore();
        });

        ctx.beginPath();
        ctx.strokeStyle = '#57f1e7';
        ctx.fillStyle = 'rgba(87, 241, 231, 0.2)';
        ctx.lineWidth = 2;
        skillValues.forEach((value, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const dataRadius = (radius / 100) * value;
            const x = centerX + Math.cos(angle) * dataRadius;
            const y = centerY + Math.sin(angle) * dataRadius;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    showCategoryContent(index, activeEl) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.currentCategory = index;
        this.currentProject = 0;

        document.querySelectorAll('.nav-category').forEach(el => el.classList.remove('active'));
        activeEl.classList.add('active');
        
        document.querySelectorAll('.nav-project-list').forEach(list => list.remove());

        const data = portfolioData[index];
        this.updateDynamicDisplay(data);
        
        this.panelRight.style.opacity = '0';
        
        setTimeout(() => {
            this.soundSystem.play('transition');
            this.panelRight.innerHTML = '';

            if (data.isStatic) {
                this.renderStaticContent(data.content);
            } else if (data.projects) {
                this.renderProjectList(activeEl, data.projects);
                const firstProjectEl = activeEl.nextElementSibling.querySelector('.nav-project');
                if (firstProjectEl) {
                    this.selectProject(firstProjectEl, data.projects[0], 0, index, false);
                }
            }
            
            this.panelRight.scrollTop = 0;
            this.panelRight.style.opacity = '1';
            this.isTransitioning = false;
        }, 300);
    }
    
    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                    if (targetTab === 'skills') this.drawSkillsRadar();
                }
                this.soundSystem.play('click');
            });
        });
    }
    
    drawSkillsRadar() {
        const canvas = document.getElementById('skills-radar');
        if (!canvas) return;
        
        const skills = {"Diseño Gráfico": 85, "UI/UX": 75, "Social Media": 70, "Desarrollo Web": 60, "Copywriting": 65, "Motion Graphics": 50};
        
        const radarDrawer = { radarCanvas: canvas, drawRadarChart: this.drawRadarChart };
        radarDrawer.drawRadarChart(skills);
    }
    
    renderProjectList(categoryEl, projects) {
        const listEl = document.createElement('div');
        listEl.className = 'nav-project-list';
        listEl.setAttribute('role', 'list');
        
        projects.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'nav-project';
            projectEl.setAttribute('role', 'listitem');
            projectEl.setAttribute('tabindex', '0');
            projectEl.innerText = project.title;
            
            projectEl.addEventListener('mouseenter', () => this.soundSystem.play('hover'));
            projectEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectProject(projectEl, project, index, categoryEl.dataset.index);
            });
            projectEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') this.selectProject(projectEl, project, index, categoryEl.dataset.index);
            });
            listEl.appendChild(projectEl);
        });
        
        categoryEl.after(listEl);
    }
    
    selectProject(projectEl, project, index, categoryIndex, playSound = true) {
        if (playSound) this.soundSystem.play('click');

        document.querySelectorAll('.nav-project').forEach(p => p.classList.remove('active'));
        projectEl.classList.add('active');
        this.currentProject = index;
        
        this.updateDynamicDisplay(portfolioData[categoryIndex], project);
        
        this.renderProjectDetails(project);
        this.panelRight.scrollTop = 0;
    }
    
    renderStaticContent(content) {
        this.panelRight.innerHTML = `<div class="project-content">${content}</div>`;
        this.initializeTabs();
        if (document.querySelector('.tab-button.active[data-tab="skills"]')) {
            this.drawSkillsRadar();
        }
    }
    
    renderProjectDetails(project) {
        let mediaHTML = '';
        if (project.gallery?.length) {
            mediaHTML = `<div class="project-gallery">${project.gallery.map((url, i) => `<div class="gallery-item" data-index="${i}"><img src="${url}" alt="${project.title} - Imagen ${i + 1}" loading="lazy"></div>`).join('')}</div>`;
        } else if (project.imageUrl) {
            mediaHTML = `<div class="project-media-container"><img src="${project.imageUrl}" alt="${project.title}" class="project-media" loading="lazy"></div>`;
        }
        if (project.stories?.length) {
            mediaHTML += `<div class="stories-container"><div class="detail-title">STORIES:</div><div class="stories-gallery">${project.stories.map((url, i) => `<div class="story-item"><video src="${url}" controls loop muted playsinline loading="lazy" aria-label="Story ${i + 1}"></video></div>`).join('')}</div></div>`;
        }
        if (project.videos?.length) {
            mediaHTML += `<div class="videos-container"><div class="detail-title">VIDEOS:</div>${project.videos.map(v => `<div class="youtube-link"><a href="${v.url}" class="external-video-link" target="_blank" rel="noopener noreferrer">▶ ${v.title}</a></div>`).join('')}</div>`;
        }
        if (project.brandbook) {
            mediaHTML += `<div class="brandbook-container"><div class="detail-title">BRANDBOOK:</div><div class="brandbook-preview" data-url="${project.brandbook}"><img src="${project.brandbook}" alt="Brandbook ${project.title}" loading="lazy"><div class="brandbook-overlay"><span>📄 Ver Brandbook Completo</span></div></div></div>`;
        }

        const externalLinkHTML = project.externalLink ? `<div class="external-link-container"><button class="external-link-btn" data-url="${project.externalLink}">🔗 Visitar Sitio Web</button></div>` : '';
        
        const metaHTML = (project.año || project.client || project.platform || project.scope) ? `<div class="project-meta">${project.año ? `<div class="meta-item"><div class="meta-label">AÑO</div><div class="meta-value">${project.año}</div></div>`:''}${project.client ? `<div class="meta-item"><div class="meta-label">CLIENTE</div><div class="meta-value">${project.client}</div></div>`:''}${project.platform ? `<div class="meta-item"><div class="meta-label">PLATAFORMA</div><div class="meta-value">${project.platform}</div></div>`:''}${project.scope ? `<div class="meta-item"><div class="meta-label">ALCANCE</div><div class="meta-value">${project.scope}</div></div>`:''}</div>` : '';

        const detailsHTML = ['desafio', 'solution', 'resultado'].filter(key => project[key]).map(key => `<div class="detail-block"><div class="detail-title">${key.charAt(0).toUpperCase() + key.slice(1)}:</div><p>${project[key]}</p></div>`).join('');
        
        this.panelRight.innerHTML = `<div class="project-content"><h2>${project.title}</h2>${metaHTML}${mediaHTML}${externalLinkHTML}${detailsHTML}</div>`;
        this.setupMediaHandlers();
    }
    
    // CORRECCIÓN: Se limpia el array de la galería al inicio de la función para un estado limpio.
    setupMediaHandlers() {
        this.currentGalleryImages = []; 

        this.panelRight.querySelector('.project-media-container')?.addEventListener('click', e => this.openLightbox(e.currentTarget.querySelector('.project-media')));
        const galleryItems = this.panelRight.querySelectorAll('.gallery-item');
        if (galleryItems.length) {
            this.currentGalleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));
            galleryItems.forEach((item, index) => item.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.openLightbox(this.currentGalleryImages[this.currentImageIndex], true);
            }));
        }
        this.panelRight.querySelector('.brandbook-preview')?.addEventListener('click', e => this.openLightbox(e.currentTarget.querySelector('img')));
        this.panelRight.querySelectorAll('.external-link-btn, .external-video-link').forEach(btn => btn.addEventListener('click', e => {
            e.preventDefault();
            this.showExternalLinkWarning(btn.dataset.url || btn.href);
        }));
    }
    
    openLightbox(mediaEl, isGallery = false) {
        this.soundSystem.play('open');
        this.lightbox.querySelector('#lightbox-media')?.remove();
        
        const newMedia = mediaEl.tagName === 'VIDEO' ? document.createElement('video') : document.createElement('img');
        newMedia.id = 'lightbox-media';
        newMedia.src = mediaEl.src;
        if (newMedia.tagName === 'VIDEO') { newMedia.controls = true; newMedia.autoplay = true; }
        else { newMedia.alt = mediaEl.alt; }
        
        this.lightbox.insertBefore(newMedia, this.lightboxClose);
        
        const nav = this.lightbox.querySelector('.lightbox-nav');
        nav.classList.toggle('hidden', !isGallery || this.currentGalleryImages.length <= 1);
        if (isGallery) this.setupLightboxNavigation();
        
        this.lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    setupLightboxNavigation() {
        const prevBtn = this.lightbox.querySelector('.lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-next');
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        
        newPrev.addEventListener('click', e => { e.stopPropagation(); this.navigateLightbox(-1); });
        newNext.addEventListener('click', e => { e.stopPropagation(); this.navigateLightbox(1); });
    }
    
    navigateLightbox(direction) {
        this.soundSystem.play('click');
        const len = this.currentGalleryImages.length;
        this.currentImageIndex = (this.currentImageIndex + direction + len) % len;
        
        const newImage = this.currentGalleryImages[this.currentImageIndex];
        const lightboxImg = this.lightbox.querySelector('#lightbox-media');
        
        if (lightboxImg && newImage) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = newImage.src;
                lightboxImg.alt = newImage.alt;
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    }
    
    // CORRECCIÓN: La línea que borraba el array de la galería ha sido eliminada.
    closeLightbox(e) {
        e.stopPropagation();
        this.soundSystem.play('close');
        this.lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    showExternalLinkWarning(url) {
        this.soundSystem.play('open');
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>SALIENDO DEL PORTAFOLIO</h3>
                <p>Estás a punto de visitar un sitio web externo. Se abrirá en una nueva pestaña.</p>
                <p style="font-size: 0.9em; opacity: 0.7;">${url}</p>
                <div class="modal-buttons">
                    <button class="modal-btn" id="modal-cancel">[ CANCELAR ]</button>
                    <button class="modal-btn primary" id="modal-confirm">[ CONTINUAR ]</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        
        const escHandler = (e) => { if (e.key === 'Escape') closeModal(); };

        const closeModal = () => {
            this.soundSystem.play('close');
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        };

        modal.querySelector('#modal-cancel').onclick = closeModal;
        modal.querySelector('#modal-confirm').onclick = () => { window.open(url, '_blank'); closeModal(); };
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };
        
        document.addEventListener('keydown', escHandler);
    }
    
    handleKeyboard(e) {
        const isLightboxOpen = !this.lightbox.classList.contains('hidden');

        if (e.key === 'Escape' && isLightboxOpen) {
            this.closeLightbox(e);
            return;
        }
        
        if (isLightboxOpen && this.currentGalleryImages.length > 1) {
            if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
            if (e.key === 'ArrowRight') this.navigateLightbox(1);
            return;
        }
        
        if (this.portfolioLayout.classList.contains('hidden')) return;

        const categories = [...document.querySelectorAll('.nav-category')];
        const activeCategory = document.querySelector('.nav-category.active');

        const projectListContainer = activeCategory ? activeCategory.nextElementSibling : null;
        const projects = (projectListContainer && projectListContainer.classList.contains('nav-project-list')) 
                       ? [...projectListContainer.querySelectorAll('.nav-project')] 
                       : [];

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (projects.length > 0 && this.currentProject > 0) {
                    projects[this.currentProject - 1].click();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (projects.length > 0 && this.currentProject < projects.length - 1) {
                    projects[this.currentProject + 1].click();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (this.currentCategory > 0) categories[this.currentCategory - 1].click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (this.currentCategory < categories.length - 1) categories[this.currentCategory + 1].click();
                break;
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => new PortfolioApp());