import Phaser from 'phaser'

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' })
    }

    private incomingScore: number = 0

    init(data: any) {
        // Phaser passes data to init when scene is started via scene.start(key, data)
        this.incomingScore = (data && typeof data.score === 'number') ? data.score : 0
    }

    /**
     * create()
     * - crea un overlay HTML e carica la lista degli utenti dal server
     * - permette di inserire una email e registrare il punteggio
     */
    create() {
    // il punteggio passato dalla scena precedente è ora in this.incomingScore
    const score = this.incomingScore || 0

        // crea overlay HTML semplice (no dipendenza da plugin DOM di Phaser)
        this.createOverlay()

        // mostra messaggio iniziale nella sezione lista
        this.setListContent('<div>Caricamento...</div>')

        // carica la lista di utenti dal backend (non sovrascriverà il form)
        this.fetchAndRenderUsers()

    // aggiungi il form per la registrazione nella sezione apposita
    this.appendRegisterForm(score)
    }

    // --- overlay helpers ---
    private createOverlay() {
        // rimuovi se esiste già
        this.removeOverlay()
        const div = document.createElement('div')
        div.id = 'leaderboard-overlay'
        Object.assign(div.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(20,20,20,0.95)',
            color: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '420px',
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: '9999',
            fontFamily: 'Arial, sans-serif'
        })
        // struttura interna: header, lista e form separati
        div.innerHTML = `
            <h2 style="margin:0 0 8px 0">Classifica</h2>
            <div id="leaderboard-list">Caricamento...</div>
            <div id="leaderboard-form"></div>
        `
        document.body.appendChild(div)
    }

    // (Non usiamo più setOverlayContent; la lista e il form sono separati)
    

    private setListContent(html: string) {
        const list = document.getElementById('leaderboard-list')
        if (!list) return
        list.innerHTML = html
    }

    private appendRegisterForm(score?: number) {
        const usedScore = (typeof score === 'number') ? score : this.incomingScore || 0
    // append form inside dedicated container so fetch doesn't overwrite it
    const container = document.getElementById('leaderboard-form') || document.getElementById('leaderboard-overlay')
    if (!container) return
    if (!container) return

        const formWrapper = document.createElement('div')
        formWrapper.style.marginTop = '12px'

        const label = document.createElement('div')
        label.textContent = 'Lascia la tua email per salvare il risultato:'
        label.style.marginBottom = '6px'

        const input = document.createElement('input')
        input.type = 'email'
        input.placeholder = 'tuonome@email.com'
        Object.assign(input.style, {
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #444',
            boxSizing: 'border-box'
        })

        const btn = document.createElement('button')
        btn.textContent = 'Registrati'
        Object.assign(btn.style, {
            marginTop: '8px',
            padding: '8px 12px',
            background: '#2ecc71',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        })

        const msg = document.createElement('div')
        msg.style.marginTop = '8px'

        btn.addEventListener('click', async () => {
            const email = (input.value || '').trim()
            if (!email || !email.includes('@')) {
                msg.textContent = 'Inserisci una email valida.'
                return
            }

            // nome = parte prima della @
            const name = email.split('@')[0]

            // corpo dati per il salvataggio (usiamo usedScore)

            try {
                btn.disabled = true
                btn.textContent = 'Salvataggio...'
                const payloadToSend = { name, score: usedScore }
                console.log('LeaderboardScene: sending payload', payloadToSend)
                msg.textContent = `Invio punteggio: ${usedScore}...`
                const res = await fetch('http://localhost:3002/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadToSend)
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                msg.textContent = 'Salvataggio avvenuto con successo!'
                // nascondi label, input e bottone per evitare doppie registrazioni
                label.style.display = 'none'
                input.style.display = 'none'
                btn.style.display = 'none'
                // ricarica la classifica
                await this.fetchAndRenderUsers()
            } catch (err) {
                console.error('Errore salvataggio', err)
                msg.textContent = 'Salvataggio fallito. Controlla che il server sia raggiungibile.'
            } finally {
                btn.disabled = false
                btn.textContent = 'Registrati'
            }
        })

        formWrapper.appendChild(label)
        formWrapper.appendChild(input)
        formWrapper.appendChild(btn)
        formWrapper.appendChild(msg)

        // pulsante per tornare al gioco
        const restart = document.createElement('button')
        restart.textContent = 'Torna al gioco'
        Object.assign(restart.style, {
            marginTop: '12px',
            padding: '8px 12px',
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        })
        restart.addEventListener('click', () => {
            this.removeOverlay()
            this.scene.start('GameScene')
        })

        formWrapper.appendChild(restart)

        container.appendChild(formWrapper)
    }

    private async fetchAndRenderUsers() {
        try {
            const res = await fetch('http://localhost:3002/users')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()

            // Supportiamo più formati di risposta:
            // 1) { users: { id: userObj, ... } }  (mappa)
            // 2) { users: [ userObj, ... ] }       (array)
            // 3) [ userObj, ... ]                  (array direttamente)
            let usersArr: any[] = []
            if (Array.isArray(data)) {
                usersArr = data
            } else if (data && Array.isArray(data.users)) {
                usersArr = data.users
            } else if (data && data.users && typeof data.users === 'object') {
                usersArr = Object.keys(data.users).map(k => data.users[k])
            }

            // ordina per score decrescente
            usersArr.sort((a: any, b: any) => (b.score || 0) - (a.score || 0))

            // rendi HTML e inseriscilo solo nella sezione lista
            const html = ['<ol style="padding-left:18px; margin:6px 0">']
            usersArr.forEach((u: any) => {
                html.push(`<li style="margin:6px 0"><strong>${this.escapeHtml((u && u.name) || '---')}</strong> — ${u && (u.score || 0)}</li>`)
            })
            html.push('</ol>')

            this.setListContent(html.join(''))
        } catch (err) {
            console.error('Errore fetching users', err)
            this.setListContent('<div>Impossibile caricare la classifica. Controlla il server su http://localhost:3002</div>')
        }
    }

    private escapeHtml(s: string) {
        return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c])
    }

    private removeOverlay() {
        const el = document.getElementById('leaderboard-overlay')
        if (el && el.parentNode) el.parentNode.removeChild(el)
    }

    shutdown() {
        this.removeOverlay()
    }

    // anche quando la scena viene spenta
    destroy() {
        this.removeOverlay()
    }
}
