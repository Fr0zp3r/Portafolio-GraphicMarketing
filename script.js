// =================================================================================
// Sound System Manager
// =================================================================================
// Gestiona la creación y reproducción de todos los efectos de sonido de la aplicación
// utilizando la Web Audio API de forma procedural. Esto evita la necesidad de cargar
// archivos de audio, manteniendo la aplicación ligera y rápida.
// La inicialización es diferida hasta la primera interacción del usuario.
// =================================================================================

class SoundSystem {
    /**
     * @constructor
     * Inicializa las propiedades por defecto del sistema de sonido.
     */
    constructor() {
        this.audioContext = null;
        this.masterGainNode = null;
        this.sounds = {};
        this.initialized = false;
        this.isMuted = false;
        this.volume = 0.2; // Volumen general bajo para no ser intrusivo.
    }
    
    /**
     * Inicializa el AudioContext y todos los nodos de audio necesarios.
     * Este método se ejecuta una sola vez para prevenir la creación de múltiples
     * contextos de audio. Es invocado por la primera interacción del usuario.
     * @async
     */
    async init() {
        if (this.initialized) return;
        
        try {
            // Se asegura la compatibilidad con navegadores más antiguos.
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.gain.value = this.isMuted ? 0 : this.volume;
            this.masterGainNode.connect(this.audioContext.destination);
            
            // Genera y almacena todos los sonidos proceduralmente al iniciar.
            this.sounds = {
                boot: this.createBootSound(),
                click: this.createClickSound(),
                hover: this.createHoverSound(),
                transition: this.createTransitionSound(),
                open: this.createClickSound(),    // Reutiliza el sonido de clic para consistencia.
                close: this.createClickSound()   // Reutiliza el sonido de clic.
            };
            
            this.initialized = true;
        } catch (error) {
            console.error('La inicialización del sistema de audio ha fallado:', error);
        }
    }

    /**
     * Libera los recursos del AudioContext para una gestión de memoria adecuada.
     * Esencial para llamar cuando la página se va a descargar (unload).
     */
    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
            this.masterGainNode = null;
            this.sounds = {};
            this.initialized = false;
        }
    }

    /**
     * Alterna el estado de silencio (mute) del audio.
     * @returns {boolean} El nuevo estado de mute.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGainNode) {
            // `setValueAtTime` es preferible para cambios de audio precisos.
            this.masterGainNode.gain.setValueAtTime(
                this.isMuted ? 0 : this.volume,
                this.audioContext.currentTime
            );
        }
        return this.isMuted;
    }
    
    /**
     * Crea el sonido de arranque (boot).
     * Combina dos osciladores para un sonido más complejo y rico.
     * @returns {Function} Una función que, al ser llamada, reproduce el sonido.
     */
    createBootSound() {
        return () => {
            if (this.isMuted || !this.audioContext) return;
            
            const osc1 = this.audioContext.createOscillator();
            const osc2 = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc1.frequency.setValueAtTime(100, this.audioContext.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.2);
            
            osc2.type = 'sawtooth'; // Diente de sierra para un sonido más "retro-digital".
            osc2.frequency.setValueAtTime(200, this.audioContext.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
            
            // Envolvente de volumen: un rápido fade-in y un fade-out más lento.
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc1.start();
            osc2.start();
            // Limpieza automática de los osciladores una vez que terminan.
            osc1.stop(this.audioContext.currentTime + 0.5);
            osc2.stop(this.audioContext.currentTime + 0.5);
        };
    }
    
    /**
     * Crea un sonido de clic agudo y corto.
     * @returns {Function} Una función que, al ser llamada, reproduce el sonido.
     */
    createClickSound() {
        return () => {
            if (this.isMuted || !this.audioContext) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'triangle'; // Un tono más suave que 'square'.
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05); // Pitch-down rápido.
            
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1); // Decaimiento rápido.
            
            osc.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        };
    }
    
    /**
     * Crea un sonido sutil y breve para el evento hover.
     * @returns {Function} Una función que, al ser llamada, reproduce el sonido.
     */
    createHoverSound() {
        return () => {
            if (this.isMuted || !this.audioContext) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
            osc.type = 'sine'; // Tono puro para un efecto discreto.
            
            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGainNode);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.05);
        };
    }

    /**
     * Crea un sonido de "swoosh" para transiciones de contenido.
     * @returns {Function} Una función que, al ser llamada, reproduce el sonido.
     */
    createTransitionSound() {
        return () => {
            if (this.isMuted || !this.audioContext) return;
            
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter(); // Filtro para modelar el sonido.
            
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
    
    /**
     * Reproduce un sonido específico a partir de su nombre.
     * @param {string} soundName - El identificador del sonido a reproducir (ej. 'click').
     */
    play(soundName) {
        if (!this.initialized || this.isMuted || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName]();
        } catch (error) {
            console.error(`Error durante la reproducción del sonido '${soundName}':`, error);
        }
    }
}

// =================================================================================
// Data Store
// =================================================================================
// Un único objeto que contiene toda la información de los proyectos y contenido.
// Esto desacopla el contenido de la lógica de la aplicación, facilitando
// futuras actualizaciones del portafolio.
// =================================================================================

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
        <nav class="tab-navigation" role="tablist">
            <button class="tab-button active" data-tab="intro" role="tab" aria-selected="true" aria-controls="intro">
                <span class="tab-ascii-top">╔═══════════╗</span>
                <span class="tab-ascii-middle">   INTRO   </span>
                <span class="tab-ascii-bottom">╚═══════════╝</span>
                <span class="tab-mobile">SOBRE MI</span>
            </button>
            <button class="tab-button" data-tab="timeline" role="tab" aria-selected="false" aria-controls="timeline">
                <span class="tab-ascii-top">╔═══════════╗</span>
                <span class="tab-ascii-middle"> TIMELINE </span>
                <span class="tab-ascii-bottom">╚═══════════╝</span>
                <span class="tab-mobile">TIMELINE</span>
            </button>
            <button class="tab-button" data-tab="skills" role="tab" aria-selected="false" aria-controls="skills">
                <span class="tab-ascii-top">╔═══════════╗</span>
                <span class="tab-ascii-middle">  SKILLS   </span>
                <span class="tab-ascii-bottom">╚═══════════╝</span>
                <span class="tab-mobile">SKILLS</span>
            </button>
            <button class="tab-button" data-tab="proceso" role="tab" aria-selected="false" aria-controls="proceso">
                <span class="tab-ascii-top">╔═══════════╗</span>
                <span class="tab-ascii-middle">  PROCESO  </span>
                <span class="tab-ascii-bottom">╚═══════════╝</span>
                <span class="tab-mobile">PROCESO</span>
            </button>
        </nav>
        <!-- resto del contenido... -->
    </div>
                
                <article class="tab-content active" id="intro" role="tabpanel">
                    <h2>HOLA, SOY JULIO</h2>
                    <p>Diseñador multidisciplinario enfocado en crear sistemas visuales que <span class="highlight">funcionan</span> y <span class="highlight">comunican</span> efectivamente.</p>
                    <p>Mi trabajo se centra en entender el problema antes de diseñar la solución. No se trata solo de hacer algo bonito, sino de crear algo que resuelva necesidades reales y genere resultados tangibles.</p>
                    <p>Creo firmemente en el poder del diseño como herramienta de transformación empresarial, donde cada decisión visual tiene un propósito claro y medible.</p>
                </article>
                
                <article class="tab-content" id="timeline" role="tabpanel">
                    <h2>MI TRAYECTORIA</h2>
                    <div class="timeline-container">
                        <div class="timeline-line" aria-hidden="true"></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2017</div><div class="timeline-title">Inicios como Diseñador</div><div class="timeline-description">Comencé vendiendo camisetas personalizadas con diseños propios en Facebook, explorando mi pasión por el diseño.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2018</div><div class="timeline-title">Pemol Sports - Diseñador Jr</div><div class="timeline-description">Mi primera experiencia profesional, donde aprendí sobre procesos de diseño y trabajo en equipo.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2019</div><div class="timeline-title">Inicio como Freelancer</div><div class="timeline-description">Con experiencia sólida, emprendí mi propio camino ofreciendo servicios de diseño independiente.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2020</div><div class="timeline-title">Pandemia Mundial</div><div class="timeline-description">Tiempo de reflexión y práctica intensiva. Perfeccioné mis habilidades y exploré nuevas áreas del diseño.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2021</div><div class="timeline-title">Tinema LLC - Proyecto Internacional</div><div class="timeline-description">Desde Miami, me contrataron para branding completo y diseño web para una empresa de criptomonedas. Todo remoto.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2022</div><div class="timeline-title">CashApp - Customer Service</div><div class="timeline-description">Mejoré mi inglés trabajando en soporte mientras continuaba con proyectos freelance.</div></div>
                        <div class="timeline-item"><div class="timeline-dot" aria-hidden="true"></div><div class="timeline-year">2023-2024</div><div class="timeline-title">Diamond Soft & Grandes Proyectos</div><div class="timeline-description">Trabajé en eventos internacionales como el VI Summit del Espárrago, manejé redes de empresas medianas y grandes, y realicé múltiples proyectos de branding.</div></div>
                    </div>
                </article>
                
                <article class="tab-content" id="skills" role="tabpanel">
                    <h2>HABILIDADES Y HERRAMIENTAS</h2>
                    <div class="skills-visual">
                        <canvas id="skills-radar" width="400" height="400" role="img" aria-label="Gráfico de radar mostrando niveles de habilidades"></canvas>
                    </div>
                    <section class="tools-section">
                        <h3>Herramientas</h3>
                        <div class="tools-list" role="list">
                            <span class="tool-tag" role="listitem">Adobe Creative Suite</span>
                            <span class="tool-tag" role="listitem">Figma</span>
                            <span class="tool-tag" role="listitem">Clip Studio Paint</span>
                            <span class="tool-tag" role="listitem">CapCut</span>
                            <span class="tool-tag" role="listitem">WordPress</span>
                            <span class="tool-tag" role="listitem">HTML/CSS/JS</span>
                        </div>
                    </section>
                </article>
                
                <article class="tab-content" id="proceso" role="tabpanel">
                    <h2>CÓMO TRABAJO</h2>
                    <div class="process-grid">
                        <div class="process-step"><div class="process-number">01</div><div class="process-content"><h4>Escuchar y Entender</h4><p>Cada proyecto comienza con una conversación profunda. Necesito entender no solo lo que quieres, sino por qué lo necesitas.</p></div></div>
                        <div class="process-step"><div class="process-number">02</div><div class="process-content"><h4>Investigar y Conceptualizar</h4><p>Analizo tu industria, competencia y audiencia. Luego desarrollo conceptos que conecten con tus objetivos.</p></div></div>
                        <div class="process-step"><div class="process-number">03</div><div class="process-content"><h4>Diseñar con Propósito</h4><p>Cada elemento visual tiene una razón de ser. Creo soluciones que funcionan y comunican efectivamente.</p></div></div>
                        <div class="process-step"><div class="process-number">04</div><div class="process-content"><h4>Iterar y Perfeccionar</h4><p>El mejor diseño surge de la colaboración. Refino basándome en tu feedback hasta lograr la excelencia.</p></div></div>
                    </div>
                </article>
                
                <section class="contact-section">
                    <h3>Trabajemos Juntos</h3>
                    <p>Si tienes un proyecto en mente o simplemente quieres conversar sobre diseño, me encantaría escucharte.</p>
                    <div class="contact-grid">
                        <div class="contact-item"><span class="contact-label">EMAIL</span><a href="mailto:julioerty@gmail.com">julioerty@gmail.com</a></div>
                        <div class="contact-item"><span class="contact-label">TELÉFONO</span><a href="tel:+529833077150">+52 983 307 7150</a></div>
                        <div class="contact-item"><span class="contact-label">BEHANCE</span><a href="https://behance.net/juliomorcillo" target="_blank" rel="noopener noreferrer">behance.net/juliomorcillo</a></div>
                        <div class="contact-item"><span class="contact-label">LINKEDIN</span><a href="www.linkedin.com/in/julio-a-morcillo-baquedano-559171362" target="_blank" rel="noopener noreferrer">linkedin.com/in/julio-a-morcillo-baquedano-559171362</a></div>
                        <div class="contact-item"><span class="contact-label">UBICACIÓN</span><span>Mérida, Yucatán, México</span></div>
                    </div>
                </section>
            </div>
        `
    },
    {
        category: "Identidad de Marca",
        projects: [
            { 
                title: "VI Summit Espárrago 2025",
                iconUrl: "assets/esparragosvisummit.png",
                gallery: ["https://i.imgur.com/pzaXwLb.png", "https://i.imgur.com/87VilOg.png", "https://i.imgur.com/b6AFnfg.png", "https://i.imgur.com/Wl9CtDC.jpeg"],
                videos: [{ title: "Grabación del evento", url: "https://youtu.be/2OzDdQZfW4Q" }, { title: "Anuncio promocional", url: "https://youtu.be/x538lxuaVp8" }],
                cliente: "Foro Internacional del Espárrago", alcance: "Internacional", año: "2025",
                skills: {"Diseño Gráfico": 35, "UI/UX": 5, "Social Media": 25, "Desarrollo Web": 5, "Copywriting": 15, "Motion Graphics": 15},
                desafio: "Crear una identidad visual memorable para un evento internacional que atrajera a productores y compradores de 15 países.",
                solución: "Colaboré en la conceptualización del logotipo y lideré el desarrollo del sistema visual completo del evento, incluyendo señalética, plantillas y merch.",
                resultado: "La identidad contribuyó a establecer el evento como referente en la industria, con asistentes de más de 15 países."
            },
            { 
                title: "AT solucións",
                iconUrl: "assets/amerimexrebrand.png",
                gallery: ["https://i.imgur.com/V7mTrXE.png", "https://i.imgur.com/qnNKV3z.png", "https://i.imgur.com/SzCtABE.jpeg"],
                cliente: "Amerimex", año: "2024",
                skills: {"Diseño Gráfico": 80, "UI/UX": 0, "Social Media": 10, "Desarrollo Web": 0, "Copywriting": 10, "Motion Graphics": 0},
                desafio: "Modernizar la imagen de una empresa con 20 años en el mercado sin perder su esencia.",
                solución: "Dirigí el rediseño del logotipo y definí una nueva paleta de colores y elementos visuales para su uso en materiales digitales y corporativos.",
                resultado: "El nuevo branding lamentablemente no alcanzó a la producción, pero de todas maneras me encargaron el diseño y desarrollo de la portal web oficial de Amerimex."
            },
            {
                title: "Alfa Comunicaciones",
                iconUrl: "assets/alfa.png",
                gallery: ["https://i.imgur.com/2QppxNG.png", "https://i.imgur.com/ttGX7ql.png", "https://i.imgur.com/4BGodmH.png", "https://i.imgur.com/qw9vtgh.png"],
                cliente: "Alfa Comunicaciones", alcance: "Regional", año: "2024",
                skills: {"Diseño Gráfico": 65, "UI/UX": 5, "Social Media": 15, "Desarrollo Web": 0, "Copywriting": 15, "Motion Graphics": 0},
                desafio: "Desarrollar una identidad que comunicara innovación tecnológica y confiabilidad en el sector de telecomunicaciones.",
                solución: "Creé un sistema de identidad completo incluyendo logotipo, paleta de colores corporativos, y aplicaciones en papelería y material digital.",
                resultado: "La nueva identidad ayudó a posicionar a la empresa como una opción confiable y moderna en el mercado regional de telecomunicaciones."
            },
            {
                title: "Consentido - Estancia Vinícola",
                iconUrl: "assets/consentidovino.png",
                gallery: ["https://i.imgur.com/5lb9MSL.png", "https://i.imgur.com/nmfErWI.png", "https://i.imgur.com/5tqQeBL.png", "https://i.imgur.com/SPRA40X.png"],
                brandbook: "assets/BRANDBOOK CONSENTIDO_01.pdf",
                cliente: "Consentido", tipo: "Estancia Vinícola", año: "2025",
                skills: {"Diseño Gráfico": 70, "UI/UX": 0, "Social Media": 10, "Desarrollo Web": 0, "Copywriting": 20, "Motion Graphics": 0},
                desafio: "Crear una identidad visual que transmitiera elegancia, tradición y el carácter artesanal de los vinos.",
                solución: "Desarrollé un sistema completo de identidad incluyendo logotipo, paleta de colores inspirada en la tierra y el vino, y un brandbook detallado.",
                resultado: "La marca logró posicionarse como referente de calidad y lujo en el mercado vinícola, y turístico internacional."
            }
        ]
    },
    {
        "category": "Experiencias Digitales",
        "projects": [
            { 
                "title": "AMXiTech.com",
                "iconUrl": "assets/amerimexrebrand.png",
                "imageUrl": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/68c1e0222688219.67eb461cc1400.png",
                "externalLink": "https://amxitech.com",
                "cliente": "AMX / iTech", "platform": "WordPress", "año": "2024",
                "skills": {"Diseño Gráfico": 10, "UI/UX": 60, "Social Media": 0, "Desarrollo Web": 20, "Copywriting": 10, "Motion Graphics": 0},
                "desafio": "Diseñar una plataforma que comunicara expertise técnico de manera accesible.",
                "solución": "Diseño de la interfaz de usuario y la experiencia de navegación para un proveedor de soluciones tecnológicas, enfocado en la claridad y la profesionalidad.",
                "resultado": "La nueva interfaz facilitó el proceso de búsqueda de información técnica y mejoró la generación de leads cualificados."
            },
            { 
                "title": "NeuromuscularMID.com",
                "iconUrl": "assets/neuromuscularcorazon.png",
                "imageUrl": "https://mir-s3-cdn-cf.behance.net/project_modules/fs/a2d34f222688275.67eb4692a7b21.png",
                "externalLink": "https://neuromuscularmid.com",
                "cliente": "Neuromuscular MID", "platform": "WordPress", "año": "2025",
                "skills": {"Diseño Gráfico": 5, "UI/UX": 80, "Social Media": 0, "Desarrollo Web": 15, "Copywriting": 0, "Motion Graphics": 0},
                "desafio": "Crear una experiencia digital que transmitiera confianza médica y fuera accesible para pacientes de todas las edades.",
                "solución": "Creación de una interfaz de usuario limpia y accesible para un centro de especialidades médicas, priorizando la facilidad de uso.",
                "resultado": "El sitio mejoró significativamente la experiencia de los pacientes al buscar información y agendar citas."
            },
            {
                "title": "Los Pollos Giros",
                "iconUrl": "assets/pollosgirosicon.png",
                "cliente": "Los Pollos Giros", "platform": "WordPress", "año": "2024",
                "skills": {"Diseño Gráfico": 20, "UI/UX": 40, "Social Media": 0, "Desarrollo Web": 40, "Copywriting": 0, "Motion Graphics": 0},
                "desafio": "Establecer presencia digital para un negocio familiar sin experiencia en línea.",
                "solución": "Creé un sitio web responsivo en WordPress, enfocándome en una UX simple y un diseño que reflejara la calidez de la marca familiar.",
                "resultado": "El sitio aumentó la reputación del lugar, al igual que acelerar y agilizar sus pedidos realizados en web."
            }
        ]
    },
    {
        "category": "Contenido Digital",
        "projects": [
            { 
                "title": "Corber MX",
                "iconUrl": "assets/corbermango.png",
                "gallery": ["https://i.imgur.com/z6sfmjh.png", "https://i.imgur.com/QR0YIl1.png", "https://i.imgur.com/TwJLShX.png", "https://i.imgur.com/XvgHfnv.png"],
                "stories": ["https://i.imgur.com/OD77saD.mp4", "https://i.imgur.com/VOEUZDx.mp4"],
                "cliente": "Corber MX (Frutas Tropicales)", "año": "2024-2025",
                "skills": {"Diseño Gráfico": 20, "UI/UX": 0, "Social Media": 50, "Desarrollo Web": 0, "Copywriting": 20, "Motion Graphics": 10},
                "desafio": "Establecer presencia profesional en redes sociales para una empresa B2B sin identidad visual digital previa.",
                "solución": "Diseñé y ejecuté una línea de contenido visual para Instagram, estableciendo una identidad visual coherente y profesional.",
                "resultado": "Se logró establecer una presencia digital sólida que generó nuevas oportunidades de negocio."
            },
            {
                "title": "Chint Sonora",
                "iconUrl": "assets/chint.png",
                "gallery": ["https://i.imgur.com/E9tNQpb.png", "https://i.imgur.com/ANxr0ii.png", "https://i.imgur.com/YYddDwY.png", "https://i.imgur.com/Iodnx9d.png", "https://i.imgur.com/7yDEaHb.png"],
                "stories": ["https://i.imgur.com/dsY6ygx.mp4", "https://i.imgur.com/YOiGGqR.mp4"],
                "cliente": "Chint Electrics", "platform": "Instagram, LinkedIn", "periodo": "2024-2025",
                "skills": {"Diseño Gráfico": 25, "UI/UX": 0, "Social Media": 45, "Desarrollo Web": 0, "Copywriting": 25, "Motion Graphics": 5},
                "desafio": "Posicionar a una marca china de componentes eléctricos en el mercado mexicano B2B.",
                "solución": "Desarrollé una estrategia de contenido bilingüe enfocada en educación técnica y casos de éxito locales.",
                "resultado": "Se logró establecer a Chint como una opción confiable en el mercado mexicano, generando leads cualificados consistentemente."
            },
            {
                "title": "Diamond Soft",
                "iconUrl": "assets/diamondsoftdiamante.png",
                "gallery": ["https://i.imgur.com/BZ3Ldor.png", "https://i.imgur.com/xgmHXq2.png", "https://i.imgur.com/tiXI1GE.png", "https://i.imgur.com/32PdklD.png"],
                "cliente": "Diamond Soft", "platform": "LinkedIn, Twitter", "periodo": "2024-2025",
                "skills": {"Diseño Gráfico": 30, "UI/UX": 0, "Social Media": 40, "Desarrollo Web": 0, "Copywriting": 30, "Motion Graphics": 0},
                "desafio": "Comunicar soluciones tecnológicas complejas de manera accesible para tomadores de decisión.",
                "solución": "Creé una línea gráfica minimalista pero impactante, usando infografías y casos de estudio visuales.",
                "resultado": "Se logró mejorar la comprensión de las soluciones ofrecidas y facilitar el proceso de venta."
            }
        ]
    }
];

// =================================================================================
// Boot Sequence Controller
// =================================================================================
// Orquesta la animación de arranque inicial de la terminal.
// Se adapta para ofrecer una experiencia más rápida en dispositivos móviles.
// =================================================================================

class BootSequence {
    /**
     * @constructor
     */
    constructor() {
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        // Define secuencias de texto distintas para móvil y escritorio.
        this.bootLines = this.isMobile ? [
            { text: "SISTEMA JM_2025", class: "system", delay: 50 },
            { text: "VERIFICANDO... ", class: "loading", delay: 100 },
            { text: "[OK]", class: "success", delay: 50, append: true },
            { text: "CARGANDO MÓDULOS:", class: "loading", delay: 150 },
            { text: "→ IDENTIDAD [OK]", class: "success", delay: 100 },
            { text: "→ DIGITAL [OK]", class: "success", delay: 100 },
            { text: "→ CONTENIDO [OK]", class: "success", delay: 100 },
            { text: "[██████████] 100%", class: "success", delay: 50 },
            { text: "¡BIENVENID@!", class: "system", delay: 150 }
        ] : [
            { text: "INICIANDO SISTEMA JULIO_MORCILLO_v2025...", class: "system", delay: 80 },
            { text: "VERIFICANDO MEMORIA... ", class: "loading", delay: 200 },
            { text: "[OK]", class: "success", delay: 100, append: true },
            { text: "CARGANDO MÓDULOS DE DISEÑO...", class: "loading", delay: 250 },
            { text: "  → Identidad Visual... [CARGADO]", class: "success", delay: 180 },
            { text: "  → Experiencias Digitales... [CARGADO]", class: "success", delay: 180 },
            { text: "  → Contenido Digital... [CARGADO]", class: "success", delay: 180 },
            { text: "INICIALIZANDO INTERFAZ GRÁFICA... ", class: "loading", delay: 300 },
            { text: "[████████████████████] 100%", class: "success", delay: 30, append: true },
            { text: "ESTABLECIENDO CONEXIÓN CREATIVA...", class: "system", delay: 200 },
            { text: "SISTEMA LISTO.", class: "success", delay: 150 },
            { text: "\nBIENVENID@ A MI PORTAFOLIO", class: "system", delay: 300 }
        ];
        
        this.typingSpeed = this.isMobile ? 8 : 15;
        this.currentLineIndex = 0;
        this.currentCharIndex = 0;
        this.bootContainer = document.getElementById('boot-sequence');
        this.bootLinesContainer = this.bootContainer.querySelector('.boot-lines');
        this.cursor = this.bootContainer.querySelector('.boot-cursor');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.skipButton = this.bootContainer.querySelector('.boot-skip-btn');
    }
    
    /**
     * Inicia la ejecución de la secuencia de arranque.
     * @async
     */
    async start() {
        this.welcomeScreen.classList.add('boot-hidden');
        this.cursor.classList.add('visible');
        
        let skipRequested = false;
        
        const skipSequence = (e) => {
            if (e) e.preventDefault();
            skipRequested = true;
            
            if (this.skipButton) {
                this.skipButton.style.animation = 'none';
                this.skipButton.style.opacity = '1';
                this.skipButton.innerHTML = '<span class="skip-text">[ SALTANDO... ]</span>';
                this.skipButton.removeEventListener('click', skipSequence);
            }
        };
        
        if (this.skipButton) {
            this.skipButton.addEventListener('click', skipSequence);
        }
        
        for (let i = 0; i < this.bootLines.length && !skipRequested; i++) {
            const lineData = this.bootLines[i];
            await this.typeLine(lineData);
            if (!skipRequested) {
                await this.delay(lineData.delay);
            }
        }
        
        if (this.skipButton && !skipRequested) {
            this.skipButton.style.opacity = '0';
        }
        
        if (skipRequested) {
            await this.delay(200);
        } else {
            await this.delay(500);
        }
        
        await this.fadeOut();
        this.showWelcomeScreen();
    }
    
    /**
     * Escribe una línea de texto con efecto de tipeo.
     * @param {object} lineData - El objeto que contiene el texto, clase y delay.
     * @async
     */
    async typeLine(lineData) {
        const lineElement = document.createElement('div');
        lineElement.className = `boot-line ${lineData.class}`;
        
        if (lineData.append && this.bootLinesContainer.lastElementChild) {
            const lastLine = this.bootLinesContainer.lastElementChild;
            const span = document.createElement('span');
            span.className = lineData.class;
            lastLine.appendChild(span);
            
            this.updateCursorPosition(lastLine);
            
            for (let char of lineData.text) {
                span.textContent += char;
                this.updateCursorPosition(lastLine);
                await this.delay(this.typingSpeed);
            }
        } else {
            this.bootLinesContainer.appendChild(lineElement);
            this.updateCursorPosition(lineElement);
            
            for (let char of lineData.text) {
                lineElement.textContent += char;
                this.updateCursorPosition(lineElement);
                await this.delay(this.typingSpeed);
            }
        }
    }
    
    /**
     * Actualiza la posición del cursor de texto simulado.
     * @param {HTMLElement} lineElement - El elemento de línea actual.
     */
    updateCursorPosition(lineElement) {
        const rect = lineElement.getBoundingClientRect();
        const containerRect = this.bootContainer.getBoundingClientRect();
        const textWidth = this.getTextWidth(lineElement.textContent, lineElement);
        
        this.cursor.style.left = `${rect.left - containerRect.left + textWidth}px`;
        this.cursor.style.top = `${rect.top - containerRect.top}px`;
    }
    
    /**
     * Calcula el ancho en píxeles de un texto dado.
     * @param {string} text - El texto a medir.
     * @param {HTMLElement} element - El elemento que contiene el texto para obtener su estilo.
     * @returns {number} El ancho del texto en píxeles.
     */
    getTextWidth(text, element) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const style = window.getComputedStyle(element);
        context.font = `${style.fontSize} ${style.fontFamily}`;
        return context.measureText(text).width;
    }
    
    /**
     * Crea una pausa en la ejecución.
     * @param {number} ms - Milisegundos a esperar.
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Anima la desaparición del contenedor de arranque.
     * @async
     */
    async fadeOut() {
        this.bootContainer.style.animation = 'bootFadeOut 0.6s ease-out forwards';
        await this.delay(600);
        this.bootContainer.style.display = 'none';
    }
    
    /**
     * Muestra la pantalla de bienvenida e inicia la animación de "descifrado" de texto.
     */
    showWelcomeScreen() {
        this.welcomeScreen.classList.remove('boot-hidden');
        this.welcomeScreen.style.display = 'flex';
        this.initDecryptAnimationFixed();
    }
    
    /**
     * Inicia la animación de texto tipo "descifrado".
     */
    initDecryptAnimationFixed() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        const elements = document.querySelectorAll('.decrypt-text');
        
        elements.forEach(element => {
            let iteration = 0;
            const originalText = element.dataset.value;
            
            element.innerText = originalText.split("")
                .map(() => letters[Math.floor(Math.random() * letters.length)])
                .join("");
            
            element.classList.add('decrypting');
            
            const animate = () => {
                element.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (index < iteration) return originalText[index];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    element.innerText = originalText;
                    return;
                }

                iteration += 1 / 3;
                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        });
    }
}

// =================================================================================
// Main Application Controller
// =================================================================================
// Clase principal que orquesta toda la funcionalidad del portafolio,
// incluyendo la gestión de estado, la navegación, el renderizado de contenido
// y la respuesta a las interacciones del usuario.
// =================================================================================

class PortfolioApp {
    /**
     * @constructor
     */
    constructor() {
        this.soundSystem = new SoundSystem();
        this.currentCategory = 0;
        this.currentProject = 0;
        this.isTransitioning = false;
        this.currentGalleryImages = [];
        this.currentImageIndex = 0;
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        // Caché de elementos del DOM para optimizar el rendimiento.
        this.domElements = {};
        // Mapa para almacenar referencias a los event listeners para su posterior limpieza.
        this.eventListeners = new Map();
        
        this.initWithBoot();
    }

    /**
     * Lanza la secuencia de arranque y, al finalizar, inicializa la aplicación.
     * @async
     */
    async initWithBoot() {
    const bootSequence = new BootSequence();
    await bootSequence.start();
    this.init();
}
    
    /**
     * Método de inicialización principal de la aplicación.
     * @async
     */
    async init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.renderNavigation();
        this.addUiElements();
        
        // El sonido se inicializa solo tras la primera interacción del usuario.
        document.addEventListener('click', () => this.soundSystem.init(), { once: true });
        
        // Reproduce el sonido de arranque inicial.
        setTimeout(() => this.soundSystem.play('boot'), 500);
    }
    
    /**
     * Almacena referencias a los elementos del DOM más utilizados para evitar
     * consultas repetitivas al DOM.
     */
    cacheDOMElements() {
        const elementIds = [
            'welcome-screen', 'portfolio-layout', 'welcome-button',
            'panel-left', 'panel-right', 'lightbox', 'lightbox-media',
            'lightbox-close', 'dynamic-display', 'radar-chart',
            'mute-button-container', 'nav-hint-container'
        ];
        
        elementIds.forEach(id => {
            this.domElements[id] = document.getElementById(id);
        });
        
        this.domElements.asciiContainer = this.domElements['dynamic-display'].querySelector('.ascii-container');
        this.domElements.svgPlaceholder = this.domElements['dynamic-display'].querySelector('.svg-placeholder');
        this.domElements.breadcrumb = document.querySelector('.breadcrumb-current');
    }

    /**
     * Centraliza la asignación de todos los event listeners de la aplicación.
     */
    attachEventListeners() {
        // Botón de bienvenida
        this.addEventListenerWithCleanup(
            this.domElements['welcome-button'],
            'click',
            () => this.startPortfolio()
        );
        
        // Lightbox (cierre)
        this.addEventListenerWithCleanup(
            this.domElements['lightbox-close'],
            'click',
            (e) => this.closeLightbox(e)
        );
        
        this.addEventListenerWithCleanup(
            this.domElements['lightbox'],
            'click',
            (e) => {
                if (e.target === this.domElements['lightbox']) {
                    this.closeLightbox(e);
                }
            }
        );
        
        // Navegación por teclado
        this.addEventListenerWithCleanup(
            document,
            'keydown',
            (e) => this.handleKeyboard(e)
        );
        
        // Detección de redimensionamiento de ventana (con debounce para optimizar).
        this.addEventListenerWithCleanup(
            window,
            'resize',
            this.debounce(() => {
                this.isMobile = window.matchMedia('(max-width: 768px)').matches;
            }, 250)
        );

        // Delegación de eventos en el panel derecho para manejar clics en media.
        this.addEventListenerWithCleanup(
            this.domElements['panel-right'],
            'click',
            (e) => {
                const target = e.target;
                const parent = target.parentElement;
                
                if (parent && parent.classList.contains('project-media-container')) {
                    this.openLightbox(parent.querySelector('.project-media'));
                }
                
                const galleryItem = target.closest('.gallery-item');
                if (galleryItem) {
                    const galleryItems = this.domElements['panel-right'].querySelectorAll('.gallery-item');
                    this.currentGalleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));
                    const index = parseInt(galleryItem.dataset.index);
                    this.currentImageIndex = index;
                    this.openLightbox(this.currentGalleryImages[index], true);
                }
                
                const brandbookPreview = target.closest('.brandbook-preview');
                if (brandbookPreview) {
                    this.openLightbox(brandbookPreview.querySelector('img'));
                }
                
                if (target.classList.contains('external-link-btn')) {
                    e.preventDefault();
                    this.showExternalLinkWarning(target.dataset.url);
                }
                
                if (target.classList.contains('external-video-link')) {
                    e.preventDefault();
                    this.showExternalLinkWarning(target.href);
                }
            }
        );
    }
    
    /**
     * Un wrapper para `addEventListener` que también registra el listener
     * para poder eliminarlo fácilmente más tarde.
     * @param {EventTarget} element - El elemento del DOM.
     * @param {string} event - El nombre del evento.
     * @param {Function} handler - La función a ejecutar.
     */
    addEventListenerWithCleanup(element, event, handler) {
        if (!element) return;
        
        element.addEventListener(event, handler);
        
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }
    
    /**
     * Elimina todos los event listeners registrados para prevenir memory leaks.
     */
    cleanup() {
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
        
        this.soundSystem.cleanup();
    }
    
    /**
     * Utilidad para retrasar la ejecución de una función (evita llamadas excesivas en eventos como 'resize').
     * @param {Function} func - La función a "debounc-ear".
     * @param {number} wait - El tiempo de espera en milisegundos.
     * @returns {Function} La nueva función con el debounce aplicado.
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Animación de "descifrado" de texto (versión inicial).
     */
    initDecryptAnimation() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        const elements = document.querySelectorAll('.decrypt-text');
        
        elements.forEach(element => {
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

    /**
     * Agrega elementos de UI flotantes como el botón de mute y la pista de navegación.
     */
    addUiElements() {
        // Botón de Mute
        const muteButton = document.createElement('button');
        muteButton.id = 'mute-button';
        muteButton.setAttribute('aria-label', 'Silenciar sonido');
        muteButton.innerHTML = `<span class="speaker-icon"></span>`;
        
        this.addEventListenerWithCleanup(muteButton, 'click', () => {
            const isMuted = this.soundSystem.toggleMute();
            muteButton.classList.toggle('muted', isMuted);
            muteButton.setAttribute('aria-label', isMuted ? 'Activar sonido' : 'Silenciar sonido');
        });
        
        this.domElements['mute-button-container'].appendChild(muteButton);

        // Pista de navegación (solo para escritorio)
        if (!this.isMobile) {
            const hint = document.createElement('div');
            hint.className = 'nav-hint';
            hint.innerHTML = 'Navegación: ↑↓ Proyectos • ← → Categorías';
            this.domElements['nav-hint-container'].appendChild(hint);
        }
    }
    
    /**
     * Inicia la transición de la pantalla de bienvenida al layout principal del portafolio.
     */
    startPortfolio() {
        this.soundSystem.play('click');
        this.domElements['welcome-screen'].style.animation = 'fadeOut 0.5s forwards';
        
        setTimeout(() => {
            this.domElements['welcome-screen'].classList.add('hidden');
            this.domElements['portfolio-layout'].classList.remove('hidden');
            
            const defaultIndex = portfolioData.findIndex(cat => cat.isDefault);
            const defaultCategory = document.querySelector(`.nav-category[data-index="${defaultIndex}"]`);
            
            if (defaultCategory) {
                this.showCategoryContent(defaultIndex, defaultCategory);
            }
            
            this.soundSystem.play('transition');
        }, 500);
    }
    
    /**
     * Renderiza la navegación principal por categorías en el panel izquierdo.
     */
    renderNavigation() {
        const fragment = document.createDocumentFragment();
        
        portfolioData.forEach((data, index) => {
            const el = document.createElement('div');
            el.className = 'nav-category';
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
            el.setAttribute('aria-label', `Categoría: ${data.category}`);
            el.innerHTML = `<span class="prompt" aria-hidden="true">></span> <span class="category-name">${data.category}</span>`;
            el.dataset.index = index;
            
            fragment.appendChild(el);
        });
        
        this.domElements['panel-left'].appendChild(fragment);
        
        // Se usa delegación de eventos para optimizar.
        this.addEventListenerWithCleanup(
            this.domElements['panel-left'],
            'mouseenter',
            (e) => {
                if (e.target.classList.contains('nav-category')) {
                    this.soundSystem.play('hover');
                }
            },
            true
        );
        
        this.addEventListenerWithCleanup(
            this.domElements['panel-left'],
            'click',
            (e) => {
                const navCategory = e.target.closest('.nav-category');
                if (navCategory) {
                    const index = parseInt(navCategory.dataset.index);
                    this.handleCategoryClick(navCategory, index);
                }
            }
        );
        
        this.addEventListenerWithCleanup(
            this.domElements['panel-left'],
            'keypress',
            (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const navCategory = e.target.closest('.nav-category');
                    if (navCategory) {
                        const index = parseInt(navCategory.dataset.index);
                        this.handleCategoryClick(navCategory, index);
                    }
                }
            }
        );
    }
    
    /**
     * Maneja el evento de clic en una categoría.
     * @param {HTMLElement} el - El elemento de la categoría que recibió el clic.
     * @param {number} index - El índice de la categoría.
     */
    handleCategoryClick(el, index) {
        if (this.isTransitioning || el.classList.contains('active')) return;
        this.soundSystem.play('click');
        this.showCategoryContent(index, el);
    }
    
    /**
     * Actualiza el panel dinámico izquierdo (con arte ASCII, icono de proyecto o gráfico de radar).
     * @param {object} data - Los datos de la categoría actual.
     * @param {object|null} project - Los datos del proyecto actual (opcional).
     */
    updateDynamicDisplay(data, project = null) {
        this.domElements.breadcrumb.textContent = project ? `${data.category} > ${project.title}` : data.category;

        if (project && project.iconUrl) {
            this.domElements.asciiContainer.style.display = 'none';
            this.domElements.svgPlaceholder.innerHTML = '';

            const iconImage = document.createElement('img');
            iconImage.src = project.iconUrl; 
            iconImage.alt = `Icono del proyecto ${project.title}`;
            iconImage.className = 'project-icon-img smooth-rendering no-shadow';
            iconImage.loading = 'lazy';

            this.domElements.svgPlaceholder.appendChild(iconImage);
            this.domElements.svgPlaceholder.style.display = 'flex';
        } else {
            this.domElements.svgPlaceholder.style.display = 'none';
            this.domElements.asciiContainer.style.display = 'flex';
            this.domElements.asciiContainer.innerHTML = `<pre>${data.asciiArt || ''}</pre>`;
        }

        const skillsToDraw = project?.skills;
        const projectRadarCanvas = this.domElements['radar-chart'];

        if (skillsToDraw) {
            projectRadarCanvas.style.display = 'block';
            this.drawRadarChart(projectRadarCanvas, skillsToDraw);
        } else {
            projectRadarCanvas.style.display = 'none';
        }
    }
    
    /**
     * Dibuja un gráfico de radar en un elemento canvas.
     * @param {HTMLCanvasElement} canvasElement - El elemento canvas donde se dibujará.
     * @param {object} skills - Un objeto con los nombres de las habilidades y sus valores.
     */
    drawRadarChart(canvasElement, skills) {
    if (!canvasElement || !skills) return;

    const ctx = canvasElement.getContext('2d');
    const { width, height } = canvasElement;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30;
    
    ctx.clearRect(0, 0, width, height);
    
    const skillNames = Object.keys(skills);
    const skillValues = Object.values(skills);
    const angleStep = (Math.PI * 2) / skillNames.length;

    // Dibuja la rejilla de fondo.
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

    // Dibuja los ejes y las etiquetas de las habilidades.
    ctx.font = '16px VT323';
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

    // Dibuja el polígono de datos de las habilidades.
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
    
    /**
     * Muestra el contenido de una categoría seleccionada, manejando la transición.
     * @param {number} index - El índice de la categoría en `portfolioData`.
     * @param {HTMLElement} activeEl - El elemento del DOM de la categoría que se activó.
     */
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
        
        this.domElements['panel-right'].style.opacity = '0';
        
        setTimeout(() => {
            this.soundSystem.play('transition');
            this.domElements['panel-right'].innerHTML = '';

            if (data.isStatic) {
                this.renderStaticContent(data.content);
            } else if (data.projects) {
                this.renderProjectList(activeEl, data.projects);
                const firstProjectEl = activeEl.nextElementSibling.querySelector('.nav-project');
                if (firstProjectEl) {
                    this.selectProject(firstProjectEl, data.projects[0], 0, index, false);
                }
            }
            
            this.domElements['panel-right'].scrollTop = 0;
            this.domElements['panel-right'].style.opacity = '1';
            this.isTransitioning = false;
        }, 300);
    }
    
    /**
     * Inicializa los listeners para la navegación por pestañas (tabs).
     */
    initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        this.addEventListenerWithCleanup(button, 'click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Si la pestaña activada es "Skills", se dibuja el gráfico.
            if (targetTab === 'skills') {
                this.drawSkillsRadar();
            }
            
            this.soundSystem.play('click');
        });
    });
}
    
    /**
     * Dibuja el gráfico de radar de habilidades principal.
     */
    drawSkillsRadar() {
    const canvas = document.getElementById('skills-radar');
    if (!canvas) return;
    
    const skills = {
        "Diseño Gráfico": 85,
        "UI/UX": 75,
        "Social Media": 70,
        "Desarrollo Web": 60,
        "Copywriting": 65,
        "Motion Graphics": 50
    };
    
    this.drawRadarChart(canvas, skills);
}
    
    /**
     * Renderiza la lista de proyectos bajo una categoría.
     * @param {HTMLElement} categoryEl - El elemento de la categoría padre.
     * @param {Array<object>} projects - El array de proyectos a renderizar.
     */
    renderProjectList(categoryEl, projects) {
        const listEl = document.createElement('div');
        listEl.className = 'nav-project-list';
        listEl.setAttribute('role', 'list');
        
        const fragment = document.createDocumentFragment();
        
        projects.forEach((project, index) => {
            const projectEl = document.createElement('div');
            projectEl.className = 'nav-project';
            projectEl.setAttribute('role', 'listitem');
            projectEl.setAttribute('tabindex', '0');
            projectEl.innerText = project.title;
            projectEl.dataset.projectIndex = index;
            
            fragment.appendChild(projectEl);
        });
        
        listEl.appendChild(fragment);
        categoryEl.after(listEl);
        
        // Delegación de eventos para los proyectos.
        this.addEventListenerWithCleanup(listEl, 'mouseenter', (e) => {
            if (e.target.classList.contains('nav-project')) {
                this.soundSystem.play('hover');
            }
        }, true);
        
        this.addEventListenerWithCleanup(listEl, 'click', (e) => {
            if (e.target.classList.contains('nav-project')) {
                e.stopPropagation();
                const projectIndex = parseInt(e.target.dataset.projectIndex);
                this.selectProject(e.target, projects[projectIndex], projectIndex, categoryEl.dataset.index);
            }
        });
        
        this.addEventListenerWithCleanup(listEl, 'keypress', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nav-project')) {
                const projectIndex = parseInt(e.target.dataset.projectIndex);
                this.selectProject(e.target, projects[projectIndex], projectIndex, categoryEl.dataset.index);
            }
        });
    }
    
    /**
     * Selecciona un proyecto, actualiza la UI y renderiza sus detalles.
     * @param {HTMLElement} projectEl - El elemento del proyecto seleccionado.
     * @param {object} project - Los datos del proyecto.
     * @param {number} index - El índice del proyecto.
     * @param {number} categoryIndex - El índice de la categoría padre.
     * @param {boolean} [playSound=true] - Indica si se debe reproducir un sonido.
     */
    selectProject(projectEl, project, index, categoryIndex, playSound = true) {
        if (playSound) this.soundSystem.play('click');

        document.querySelectorAll('.nav-project').forEach(p => p.classList.remove('active'));
        projectEl.classList.add('active');
        this.currentProject = index;
        
        this.updateDynamicDisplay(portfolioData[categoryIndex], project);
        this.renderProjectDetails(project);
        this.domElements['panel-right'].scrollTop = 0;
        
        // Scroll suave en móvil para mostrar el contenido.
        if (this.isMobile) {
            setTimeout(() => {
                this.domElements['panel-right'].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    }
    
    /**
     * Renderiza el contenido estático (como la sección "Sobre Mí").
     * @param {string} content - El contenido HTML a renderizar.
     */
    renderStaticContent(content) {
        this.domElements['panel-right'].innerHTML = `<div class="project-content">${content}</div>`;
        this.initializeTabs();
        
        if (document.querySelector('.tab-button.active[data-tab="skills"]')) {
            this.drawSkillsRadar();
        }
    }
    
    /**
     * Renderiza el HTML detallado de un proyecto en el panel derecho.
     * @param {object} project - Los datos del proyecto a renderizar.
     */
    renderProjectDetails(project) {
        // Construye el HTML para los diferentes tipos de media.
        let mediaHTML = '';
        
        if (project.gallery?.length) {
            mediaHTML = `
                <div class="project-gallery">
                    ${project.gallery.map((url, i) => `
                        <div class="gallery-item" data-index="${i}">
                            <img src="${url}" alt="${project.title} - Imagen ${i + 1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (project.imageUrl) {
            mediaHTML = `
                <div class="project-media-container">
                    <img src="${project.imageUrl}" alt="${project.title}" class="project-media" loading="lazy">
                </div>
            `;
        }
        
        if (project.stories?.length) {
            mediaHTML += `
                <div class="stories-container">
                    <div class="detail-title">STORIES:</div>
                    <div class="stories-gallery">
                        ${project.stories.map((url, i) => `
                            <div class="story-item">
                                <video src="${url}" controls loop muted playsinline loading="lazy" aria-label="Story ${i + 1}"></video>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (project.videos?.length) {
            mediaHTML += `
                <div class="videos-container">
                    <div class="detail-title">VIDEOS:</div>
                    ${project.videos.map(v => `
                        <div class="youtube-link">
                            <a href="${v.url}" class="external-video-link" target="_blank" rel="noopener noreferrer">
    <span class="btn-text">▶ ${v.title}</span>
</a>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        if (project.brandbook) {
    mediaHTML += `
        <div class="external-link-container">
                  
<a href="${project.brandbook}" class="external-link-btn" target="_blank" rel="noopener noreferrer">
    <span class="btn-text">📄 Ver Brandbook Completo</span>
</a>

    
        </div>
    `;
}
        const externalLinkHTML = project.externalLink ? `
            <div class="external-link-container">
                <button class="external-link-btn" data-url="${project.externalLink}">
    <span class="btn-text">🔗 Visitar Sitio Web</span>
</button>
            </div>
        ` : '';
        
        // Construye el HTML para la metainformación.
        const metaItems = ['año', 'cliente', 'plataforma', 'alcance']
            .filter(key => project[key])
            .map(key => `
                <div class="meta-item">
                    <div class="meta-label">${key.toUpperCase()}</div>
                    <div class="meta-value">${project[key]}</div>
                </div>
            `).join('');
            
        const metaHTML = metaItems ? `<div class="project-meta">${metaItems}</div>` : '';

        // Construye el HTML para los bloques de detalle.
        const detailsHTML = ['desafio', 'solución', 'resultado']
            .filter(key => project[key])
            .map(key => `
                <div class="detail-block">
                    <div class="detail-title">${key.charAt(0).toUpperCase() + key.slice(1)}:</div>
                    <p>${project[key]}</p>
                </div>
            `).join('');
        
        // Renderiza todo el contenido en el panel derecho.
        this.domElements['panel-right'].innerHTML = `
            <div class="project-content">
                <h2>${project.title}</h2>
                ${metaHTML}
                ${mediaHTML}
                ${externalLinkHTML}
                ${detailsHTML}
            </div>
        `;
        
        this.setupMediaHandlers();
    }
    
    /**
     * Prepara los manejadores de eventos para la media recién renderizada.
     */
    setupMediaHandlers() {
        this.currentGalleryImages = [];
    }
    
    /**
     * Abre el lightbox para mostrar una imagen o video.
     * @param {HTMLImageElement|HTMLVideoElement} mediaEl - El elemento multimedia a mostrar.
     * @param {boolean} [isGallery=false] - Indica si la imagen forma parte de una galería navegable.
     */
    openLightbox(mediaEl, isGallery = false) {
    if (!mediaEl) return;
    
    this.soundSystem.play('open');
    
    // Limpia cualquier contenido previo del lightbox.
    const existingContainer = this.domElements['lightbox'].querySelector('.lightbox-scroll-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const existingMedia = this.domElements['lightbox'].querySelector('#lightbox-media');
    if (existingMedia) {
        existingMedia.remove();
    }
    
    // Crea el nuevo elemento de media.
    const newMedia = mediaEl.tagName === 'VIDEO' 
        ? document.createElement('video') 
        : document.createElement('img');
        
    newMedia.id = 'lightbox-media';
    newMedia.src = mediaEl.src;
    
    if (newMedia.tagName === 'VIDEO') {
        newMedia.controls = true;
        newMedia.autoplay = true;
        newMedia.alt = mediaEl.alt;
        this.domElements['lightbox'].insertBefore(newMedia, this.domElements['lightbox-close']);
    } else {
        newMedia.alt = mediaEl.alt;
        
        // Detecta si la imagen es muy alta para añadir un contenedor con scroll.
        newMedia.onload = function() {
            const aspectRatio = this.naturalHeight / this.naturalWidth;
            
            if (aspectRatio > 1.5) { // Si es una imagen vertical
                const scrollContainer = document.createElement('div');
                scrollContainer.className = 'lightbox-scroll-container';
                
                const topIndicator = document.createElement('div');
                topIndicator.className = 'scroll-indicator-top';
                
                const bottomIndicator = document.createElement('div');
                bottomIndicator.className = 'scroll-indicator-bottom visible';
                
                this.style.maxHeight = 'none';
                scrollContainer.appendChild(this);
                scrollContainer.appendChild(topIndicator);
                scrollContainer.appendChild(bottomIndicator);
                
                const lightbox = document.getElementById('lightbox');
                const closeBtn = document.getElementById('lightbox-close');
                lightbox.insertBefore(scrollContainer, closeBtn);
                
                // Maneja la visibilidad de los indicadores de scroll.
                scrollContainer.addEventListener('scroll', function() {
                    const { scrollTop, scrollHeight, clientHeight } = this;
                    topIndicator.classList.toggle('visible', scrollTop > 10);
                    bottomIndicator.classList.toggle('visible', scrollTop < scrollHeight - clientHeight - 10);
                });
            } else {
                // Imagen normal, se inserta directamente.
                const lightbox = document.getElementById('lightbox');
                const closeBtn = document.getElementById('lightbox-close');
                lightbox.insertBefore(this, closeBtn);
            }
        };
    }
    
    const nav = this.domElements['lightbox'].querySelector('.lightbox-nav');
    const shouldShowNav = isGallery && this.currentGalleryImages.length > 1;
    nav.classList.toggle('hidden', !shouldShowNav);
    
    if (shouldShowNav) {
        this.setupLightboxNavigation();
        if (this.isMobile) {
            this.setupTouchGestures(newMedia);
        }
    }
    
    this.domElements['lightbox'].classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
    
    /**
     * Configura los listeners para los botones de navegación del lightbox.
     */
    setupLightboxNavigation() {
        const prevBtn = this.domElements['lightbox'].querySelector('.lightbox-prev');
        const nextBtn = this.domElements['lightbox'].querySelector('.lightbox-next');
        
        // Clona y reemplaza los botones para limpiar listeners antiguos.
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);
        
        this.addEventListenerWithCleanup(newPrev, 'click', (e) => {
            e.stopPropagation();
            this.navigateLightbox(-1);
        });
        
        this.addEventListenerWithCleanup(newNext, 'click', (e) => {
            e.stopPropagation();
            this.navigateLightbox(1);
        });
    }
    
    /**
     * Cambia la imagen mostrada en el lightbox.
     * @param {number} direction - La dirección de la navegación (-1 para anterior, 1 para siguiente).
     */
    navigateLightbox(direction) {
        this.soundSystem.play('click');
        const len = this.currentGalleryImages.length;
        this.currentImageIndex = (this.currentImageIndex + direction + len) % len;
        
        const newImage = this.currentGalleryImages[this.currentImageIndex];
        const lightboxImg = this.domElements['lightbox'].querySelector('#lightbox-media');
        
        if (lightboxImg && newImage) {
            lightboxImg.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImg.src = newImage.src;
                lightboxImg.alt = newImage.alt;
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    }
    
    /**
     * Configura los gestos táctiles (swipe) para la navegación del lightbox en móviles.
     * @param {HTMLElement} element - El elemento sobre el que se detectará el swipe.
     */
    setupTouchGestures(element) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };
        
        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        };
        
        const handleSwipe = () => {
            const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe.
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) { // Swipe hacia la derecha
                    this.navigateLightbox(-1);
                } else { // Swipe hacia la izquierda
                    this.navigateLightbox(1);
                }
            }
        };
        
        this.addEventListenerWithCleanup(element, 'touchstart', handleTouchStart, { passive: true });
        this.addEventListenerWithCleanup(element, 'touchend', handleTouchEnd, { passive: true });
    }
    
    /**
     * Cierra el lightbox.
     * @param {Event} e - El evento que dispara el cierre.
     */
    closeLightbox(e) {
        e.stopPropagation();
        this.soundSystem.play('close');
        this.domElements['lightbox'].classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    /**
     * Muestra una advertencia modal antes de abrir un enlace externo.
     * @param {string} url - La URL del enlace externo.
     */
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
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            this.soundSystem.play('close');
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        };
        
        const escHandler = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        
        document.addEventListener('keydown', escHandler);
        
        modal.querySelector('#modal-cancel').onclick = closeModal;
        modal.querySelector('#modal-confirm').onclick = () => {
            window.open(url, '_blank', 'noopener,noreferrer');
            closeModal();
        };
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }
    
    /**
     * Maneja la navegación por teclado para las categorías y proyectos.
     * @param {KeyboardEvent} e - El evento del teclado.
     */
    handleKeyboard(e) {
        const isLightboxOpen = !this.domElements['lightbox'].classList.contains('hidden');

        if (e.key === 'Escape' && isLightboxOpen) {
            this.closeLightbox(e);
            return;
        }
        
        if (isLightboxOpen && this.currentGalleryImages.length > 1) {
            if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
            if (e.key === 'ArrowRight') this.navigateLightbox(1);
            return;
        }
        
        if (this.domElements['portfolio-layout'].classList.contains('hidden')) return;
        
        if (this.isMobile) return; // Deshabilita la navegación por teclado en móvil.

        const categories = [...document.querySelectorAll('.nav-category')];
        const activeCategory = document.querySelector('.nav-category.active');
        const projectListContainer = activeCategory?.nextElementSibling;
        const projects = (projectListContainer?.classList.contains('nav-project-list')) 
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
                if (this.currentCategory > 0) {
                    categories[this.currentCategory - 1].click();
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (this.currentCategory < categories.length - 1) {
                    categories[this.currentCategory + 1].click();
                }
                break;
        }
    }
}

// =================================================================================
// Application Initializer
// =================================================================================
// Se asegura de que la aplicación se instancie cuando el DOM esté listo
// y de que se limpien los recursos (listeners) al salir de la página.
// =================================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
} else {
    new PortfolioApp();
}

window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.cleanup();
    }
});
