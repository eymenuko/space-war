// ===== UZAY SAVAŞI – GAME ENGINE =====
(() => {
    'use strict';

    // ===== DOM ELEMENTS =====
    const $ = id => document.getElementById(id);
    const canvas = $('game-canvas');
    const ctx = canvas.getContext('2d');

    const screens = {
        start: $('start-screen'),
        hangar: $('hangar-screen'),
        game: $('game-screen'),
        over: $('gameover-screen'),
        settings: $('settings-screen'),
        lab: $('lab-screen'),
        achievements: $('achievements-screen')
    };

    const hud = {
        healthBar: $('health-bar'),
        healthText: $('health-text'),
        energyBar: $('energy-bar'),
        energyText: $('energy-text'),
        bossHealthBar: $('boss-health-bar'),
        bossName: $('boss-name'),
        score: $('score'),
        wave: $('wave'),
        comboDisplay: $('combo-display'),
        messageDisplay: $('message-display'),
        coins: $('coins'),
        merchantOverlay: $('merchant-overlay'),
        merchantCoins: $('merchant-coins'),
        headList: $('head-list'),
        noHeads: $('no-heads'),
        coinDisplay: $('coin-display'),
        shopList: $('shop-list'),
        touchModeBtn: $('touch-mode-btn'),
        touchControls: $('touch-controls'),
        joystickContainer: $('joystick-container'),
        joystickBase: $('joystick-base'),
        joystickKnob: $('joystick-knob'),
        btnShoot: $('btn-shoot'),
        btnSuper: $('btn-super')
    };

    // ===== CONSTANTS =====
    const STAR_COUNT = 250;
    const MAX_ENERGY = 10;

    // ===== AUDIO MANAGER =====
    const AudioManager = {
        ctx: null,
        bgmInterval: null,
        bgmStep: 0,
        bgmNotes: [220, 220, 261.63, 293.66, 220, 220, 196, 164.81],

        init: function () {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },

        playSound: function (type) {
            if (!this.ctx || !persistentData.sfxEnabled) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;

            switch (type) {
                case 'star_hunter_shot':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(880, now);
                    osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'star_hunter_super':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.3);
                    osc.start(now);
                    osc.stop(now + 0.3);
                    break;
                case 'red_hawk_shot':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'red_hawk_super':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                    break;
                case 'titan_shield_shot':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                case 'titan_shield_super':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(100, now);
                    osc.frequency.linearRampToValueAtTime(20, now + 0.5);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                case 'ghost_blade_shot':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(1500, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'ghost_blade_super':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(2000, now);
                    osc.frequency.linearRampToValueAtTime(1500, now + 0.5);
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                case 'plasma_dragon_shot':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1200, now);
                    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
                case 'plasma_dragon_super':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(300, now + 0.5);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.5);
                    osc.start(now);
                    osc.stop(now + 0.5);
                    break;
                case 'hit':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.exponentialRampToValueAtTime(20, now + 0.1);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'explosion':
                    const bufferSize = this.ctx.sampleRate * 0.5;
                    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noise = this.ctx.createBufferSource();
                    noise.buffer = buffer;
                    const noiseFilter = this.ctx.createBiquadFilter();
                    noiseFilter.type = 'lowpass';
                    noiseFilter.frequency.value = 800;
                    noise.connect(noiseFilter);
                    noiseFilter.connect(gain);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                    noise.start(now);
                    return;
                case 'boss_shoot':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.1);
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'btn_click':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.1);
                    osc.start(now);
                    osc.stop(now + 0.1);
                    break;
                case 'gameover':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.exponentialRampToValueAtTime(50, now + 1.0);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0, now + 1.0);
                    osc.start(now);
                    osc.stop(now + 1.0);
                    break;
            }
        },

        playBGM: function () {
            this.init();
            this.stopBGM();
            if (!this.ctx || !persistentData.bgmEnabled) return;

            this.bgmInterval = setInterval(() => {
                if (this.ctx.state === 'suspended') return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(this.bgmNotes[this.bgmStep % this.bgmNotes.length] / 2, this.ctx.currentTime);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
                osc.start(this.ctx.currentTime);
                osc.stop(this.ctx.currentTime + 0.2);
                this.bgmStep++;
            }, 250);
        },

        stopBGM: function () {
            if (this.bgmInterval) {
                clearInterval(this.bgmInterval);
                this.bgmInterval = null;
            }
        }
    };

    // ===== MULTI-LANGUAGE SYSTEM =====
    function applyLanguage() {
        const lang = persistentData.language || 'tr';
        const dict = translations[lang] || translations['tr'];

        // Update all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });

        // Set RTL for Arabic
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.removeAttribute('dir');
        }

        const langSelect = $('language-select');
        if (langSelect && langSelect.value !== lang) {
            langSelect.value = lang;
        }
    }

    function t(key) {
        const lang = persistentData.language || 'tr';
        return translations[lang][key] || translations['tr'][key] || key;
    }

    // ===== SHIP DEFINITIONS =====
    const SHIP_TYPES = [
        {
            id: 'star_hunter',
            get name() { return t('ship_star_hunter'); },
            emoji: '🚀',
            get description() { return t('desc_star_hunter'); },
            price: 0,
            color: '#00f5ff',
            glowColor: 'rgba(0,245,255,0.4)',
            accentColor: '#0088cc',
            darkColor: '#004466',
            maxHP: 100,
            speed: 6,
            energyGain: 0.01,
            shotCost: 1,
            superCost: 4,
            shotDamage: 12,
            shotSpeed: 12,
            shotSize: 4,
            shotCooldown: 12,
            superCooldown: 30,
            superDamage: 25,
            get attackDesc() { return t('atk_star_hunter'); },
            get superDesc() { return t('sup_star_hunter'); },
            // Stat ratings for display (out of 10)
            hpRating: 5,
            speedRating: 5,
            damageRating: 5,
            fireShot: function (game, p) {
                AudioManager.playSound('star_hunter_shot');
                game.playerBullets.push({
                    x: p.x, y: p.y - p.height / 2,
                    vx: 0, vy: -this.shotSpeed,
                    size: this.shotSize, damage: this.shotDamage,
                    isSuper: false, life: 100, trail: [],
                    color: this.color
                });
                spawnParticles(p.x, p.y - p.height / 2, this.color, 5, 2);
            },
            fireSuper: function (game, p) {
                AudioManager.playSound('star_hunter_super');
                for (let angle = -0.15; angle <= 0.15; angle += 0.15) {
                    game.playerBullets.push({
                        x: p.x, y: p.y - p.height / 2,
                        vx: Math.sin(angle) * 8, vy: -10,
                        size: 8, damage: this.superDamage,
                        isSuper: true, life: 120, trail: [],
                        color: '#7b2ff7'
                    });
                }
                game.screenShake = 5;
                game.shakeIntensity = 4;
                spawnParticles(p.x, p.y - p.height / 2, '#7b2ff7', 15, 4);
            },
            drawShip: function (ctx, p) {
                const thruster = Math.sin(p.thrusterPhase) * 0.3 + 0.7;

                // Engine glow
                const engineGrad = ctx.createRadialGradient(0, p.height / 2 + 5, 0, 0, p.height / 2 + 5, 20 * thruster);
                engineGrad.addColorStop(0, `rgba(0,200,255,${0.8 * thruster})`);
                engineGrad.addColorStop(0.5, `rgba(123,47,247,${0.4 * thruster})`);
                engineGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = engineGrad;
                ctx.fillRect(-20, p.height / 2 - 5, 40, 30);

                // Thruster flame
                ctx.beginPath();
                ctx.moveTo(-8, p.height / 2);
                ctx.lineTo(0, p.height / 2 + 15 + 10 * thruster);
                ctx.lineTo(8, p.height / 2);
                ctx.fillStyle = `rgba(0,245,255,${0.7 * thruster})`;
                ctx.fill();

                // Ship body
                ctx.shadowColor = '#00f5ff';
                ctx.shadowBlur = 15;

                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2);
                ctx.lineTo(-p.width / 2, p.height / 3);
                ctx.lineTo(-p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 2, p.height / 3);
                ctx.closePath();

                const shipGrad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
                shipGrad.addColorStop(0, '#00d4ff');
                shipGrad.addColorStop(0.5, '#0088cc');
                shipGrad.addColorStop(1, '#004466');
                ctx.fillStyle = shipGrad;
                ctx.fill();
                ctx.strokeStyle = '#00f5ff';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Cockpit
                ctx.beginPath();
                ctx.ellipse(0, -5, 6, 10, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#00f5ff';
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1;

                // Wings
                ctx.beginPath();
                ctx.moveTo(-p.width / 2, p.height / 3);
                ctx.lineTo(-p.width / 2 - 8, p.height / 2 + 5);
                ctx.lineTo(-p.width / 4, p.height / 2);
                ctx.fillStyle = '#003355';
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(p.width / 2, p.height / 3);
                ctx.lineTo(p.width / 2 + 8, p.height / 2 + 5);
                ctx.lineTo(p.width / 4, p.height / 2);
                ctx.fillStyle = '#003355';
                ctx.fill();
            }
        },
        {
            id: 'red_hawk',
            get name() { return t('ship_red_hawk'); },
            emoji: '🦅',
            get description() { return t('desc_red_hawk'); },
            price: 500,
            color: '#ff2d55',
            glowColor: 'rgba(255,45,85,0.4)',
            accentColor: '#cc0033',
            darkColor: '#660011',
            maxHP: 80,
            speed: 8,
            energyGain: 0.015,
            shotCost: 0.9,
            superCost: 5,
            shotDamage: 8,
            shotSpeed: 15,
            shotSize: 3,
            shotCooldown: 8,
            superCooldown: 25,
            superDamage: 15,
            get attackDesc() { return t('atk_red_hawk'); },
            get superDesc() { return t('sup_red_hawk'); },
            hpRating: 3,
            speedRating: 8,
            damageRating: 6,
            fireShot: function (game, p) {
                AudioManager.playSound('red_hawk_shot');
                for (let dx = -8; dx <= 8; dx += 16) {
                    game.playerBullets.push({
                        x: p.x + dx, y: p.y - p.height / 2,
                        vx: 0, vy: -this.shotSpeed,
                        size: this.shotSize, damage: this.shotDamage,
                        isSuper: false, life: 100, trail: [],
                        color: this.color
                    });
                }
                spawnParticles(p.x, p.y - p.height / 2, this.color, 4, 2);
            },
            fireSuper: function (game, p) {
                AudioManager.playSound('red_hawk_super');
                for (let i = 0; i < 8; i++) {
                    const spread = (i - 3.5) * 0.12;
                    game.playerBullets.push({
                        x: p.x + (i - 3.5) * 10,
                        y: p.y - p.height / 2,
                        vx: Math.sin(spread) * 6,
                        vy: -12 - Math.random() * 3,
                        size: 6,
                        damage: this.superDamage,
                        isSuper: true, life: 100, trail: [],
                        color: '#ff6b35'
                    });
                }
                game.screenShake = 8;
                game.shakeIntensity = 6;
                spawnParticles(p.x, p.y - p.height / 2, '#ff6b35', 20, 5);
            },
            drawShip: function (ctx, p) {
                const thruster = Math.sin(p.thrusterPhase) * 0.3 + 0.7;

                // Dual engine glow
                for (let dx = -10; dx <= 10; dx += 20) {
                    const eg = ctx.createRadialGradient(dx, p.height / 2 + 3, 0, dx, p.height / 2 + 3, 14 * thruster);
                    eg.addColorStop(0, `rgba(255,100,0,${0.9 * thruster})`);
                    eg.addColorStop(0.5, `rgba(255,50,0,${0.4 * thruster})`);
                    eg.addColorStop(1, 'transparent');
                    ctx.fillStyle = eg;
                    ctx.fillRect(dx - 14, p.height / 2 - 3, 28, 22);

                    ctx.beginPath();
                    ctx.moveTo(dx - 5, p.height / 2);
                    ctx.lineTo(dx, p.height / 2 + 12 + 8 * thruster);
                    ctx.lineTo(dx + 5, p.height / 2);
                    ctx.fillStyle = `rgba(255,160,0,${0.8 * thruster})`;
                    ctx.fill();
                }

                ctx.shadowColor = '#ff4444';
                ctx.shadowBlur = 15;

                // Sleek arrow body
                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2 - 5);
                ctx.lineTo(-p.width / 3, 0);
                ctx.lineTo(-p.width / 2 - 5, p.height / 3);
                ctx.lineTo(-p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 2 + 5, p.height / 3);
                ctx.lineTo(p.width / 3, 0);
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
                grad.addColorStop(0, '#ff4444');
                grad.addColorStop(0.5, '#cc2200');
                grad.addColorStop(1, '#661100');
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.strokeStyle = '#ff6644';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Center stripe
                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2 - 5);
                ctx.lineTo(-3, p.height / 4);
                ctx.lineTo(3, p.height / 4);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255,200,100,0.3)';
                ctx.fill();

                // Cockpit
                ctx.beginPath();
                ctx.ellipse(0, -8, 5, 8, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ffaa44';
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        },
        {
            id: 'titan',
            get name() { return t('ship_titan'); },
            emoji: '🛡️',
            get description() { return t('desc_titan'); },
            price: 1200,
            color: '#ff9900',
            glowColor: 'rgba(255,153,0,0.4)',
            accentColor: '#cc7a00',
            darkColor: '#663d00',
            maxHP: 200,
            speed: 4,
            energyGain: 0.008,
            shotCost: 2,
            superCost: 8,
            shotDamage: 20,
            shotSpeed: 8,
            shotSize: 8,
            shotCooldown: 20,
            superCooldown: 60,
            superDamage: 60,
            get attackDesc() { return t('atk_titan'); },
            get superDesc() { return t('sup_titan'); },
            hpRating: 9,
            speedRating: 3,
            damageRating: 7,
            fireShot: function (game, p) {
                AudioManager.playSound('titan_shield_shot');
                game.playerBullets.push({
                    x: p.x, y: p.y - p.height / 2,
                    vx: 0, vy: -this.shotSpeed,
                    size: this.shotSize, damage: this.shotDamage,
                    isSuper: false, life: 120, trail: [],
                    color: this.color
                });
                spawnParticles(p.x, p.y - p.height / 2, this.color, 6, 3);
            },
            fireSuper: function (game, p) {
                AudioManager.playSound('titan_shield_super');
                // Shockwave: clear boss bullets + damage boss
                game.bossBullets = [];
                if (game.boss && !game.boss.entering) {
                    game.boss.hp -= this.superDamage;
                    spawnDamageNumber(game.boss.x, game.boss.y - 30, this.superDamage, '#ffd700');
                    spawnParticles(game.boss.x, game.boss.y, '#ffd700', 25, 6);
                }
                // Visual shockwave
                game.explosions.push({
                    x: p.x, y: p.y, color: '#ffd700',
                    size: canvas.width, life: 20, maxLife: 20
                });
                game.screenShake = 12;
                game.shakeIntensity = 10;
                showMessage(t('msg_shockwave'), '#ffd700');
            },
            drawShip: function (ctx, p) {
                const thruster = Math.sin(p.thrusterPhase) * 0.3 + 0.7;

                // Engine glow
                const eg = ctx.createRadialGradient(0, p.height / 2 + 5, 0, 0, p.height / 2 + 5, 22 * thruster);
                eg.addColorStop(0, `rgba(255,200,0,${0.8 * thruster})`);
                eg.addColorStop(0.5, `rgba(255,150,0,${0.4 * thruster})`);
                eg.addColorStop(1, 'transparent');
                ctx.fillStyle = eg;
                ctx.fillRect(-22, p.height / 2 - 5, 44, 30);

                ctx.beginPath();
                ctx.moveTo(-10, p.height / 2);
                ctx.lineTo(0, p.height / 2 + 10 + 8 * thruster);
                ctx.lineTo(10, p.height / 2);
                ctx.fillStyle = `rgba(255,220,100,${0.7 * thruster})`;
                ctx.fill();

                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 18;

                // Wide heavy body
                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2 + 5);
                ctx.lineTo(-p.width / 2 - 4, p.height / 5);
                ctx.lineTo(-p.width / 2 - 2, p.height / 2 - 5);
                ctx.lineTo(-p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 4, p.height / 2);
                ctx.lineTo(p.width / 2 + 2, p.height / 2 - 5);
                ctx.lineTo(p.width / 2 + 4, p.height / 5);
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
                grad.addColorStop(0, '#ffd700');
                grad.addColorStop(0.4, '#cc9900');
                grad.addColorStop(1, '#664400');
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.strokeStyle = '#ffdd44';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Shield emblem
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,0.15)';
                ctx.fill();
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Cockpit
                ctx.beginPath();
                ctx.ellipse(0, -8, 7, 9, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ffdd44';
                ctx.globalAlpha = 0.5;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        },
        {
            id: 'ghost',
            get name() { return t('ship_ghost'); },
            emoji: '👻',
            get description() { return t('desc_ghost'); },
            price: 2500,
            color: '#c850c0',
            glowColor: 'rgba(200,80,192,0.4)',
            accentColor: '#4158d0',
            darkColor: '#201040',
            maxHP: 70,
            speed: 10,
            energyGain: 0.02,
            shotCost: 1.5,
            superCost: 6,
            shotDamage: 15,
            shotSpeed: 20,
            shotSize: 2,
            shotCooldown: 10,
            superCooldown: 90,
            superDamage: 5,
            get attackDesc() { return t('atk_ghost'); },
            get superDesc() { return t('sup_ghost'); },
            hpRating: 2,
            speedRating: 10,
            damageRating: 4,
            fireShot: function (game, p) {
                AudioManager.playSound('ghost_blade_shot');
                for (let dx = -6; dx <= 6; dx += 12) {
                    game.playerBullets.push({
                        x: p.x + dx, y: p.y - p.height / 2,
                        vx: 0, vy: -this.shotSpeed,
                        size: this.shotSize, damage: this.shotDamage,
                        isSuper: false, life: 80, trail: [],
                        color: this.color
                    });
                }
                spawnParticles(p.x, p.y - p.height / 2, this.color, 3, 1.5);
            },
            fireSuper: function (game, p) {
                AudioManager.playSound('ghost_blade_super');
                // Phase shift: %30 damage reduction + auto fire (no full invincibility)
                p.damageReduction = 300; // 5 seconds
                p.autoFire = 300;
                game.screenShake = 4;
                game.shakeIntensity = 3;
                spawnParticles(p.x, p.y, '#c850c0', 30, 6);
                showMessage(t('msg_ghost_shift'), '#c850c0');
            },
            drawShip: function (ctx, p) {
                const thruster = Math.sin(p.thrusterPhase) * 0.3 + 0.7;
                const ghostAlpha = p.damageReduction > 0 ? 0.5 + Math.sin(p.thrusterPhase * 5) * 0.2 : 1;

                ctx.globalAlpha = ghostAlpha;

                // Subtle engine
                const eg = ctx.createRadialGradient(0, p.height / 2 + 3, 0, 0, p.height / 2 + 3, 12 * thruster);
                eg.addColorStop(0, `rgba(200,80,192,${0.7 * thruster})`);
                eg.addColorStop(1, 'transparent');
                ctx.fillStyle = eg;
                ctx.fillRect(-12, p.height / 2 - 3, 24, 20);

                ctx.beginPath();
                ctx.moveTo(-4, p.height / 2);
                ctx.lineTo(0, p.height / 2 + 10 + 6 * thruster);
                ctx.lineTo(4, p.height / 2);
                ctx.fillStyle = `rgba(200,80,192,${0.6 * thruster})`;
                ctx.fill();

                ctx.shadowColor = '#c850c0';
                ctx.shadowBlur = 12;

                // Slim dagger shape
                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2 - 8);
                ctx.lineTo(-p.width / 4, -p.height / 6);
                ctx.lineTo(-p.width / 2, p.height / 4);
                ctx.lineTo(-p.width / 3, p.height / 2);
                ctx.lineTo(p.width / 3, p.height / 2);
                ctx.lineTo(p.width / 2, p.height / 4);
                ctx.lineTo(p.width / 4, -p.height / 6);
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
                grad.addColorStop(0, '#c850c0');
                grad.addColorStop(0.5, '#9030a0');
                grad.addColorStop(1, '#4a1060');
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.strokeStyle = '#dd70dd';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Cockpit
                ctx.beginPath();
                ctx.ellipse(0, -6, 4, 7, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#dd88dd';
                ctx.globalAlpha = ghostAlpha * 0.5;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        },
        {
            id: 'dragon',
            get name() { return t('ship_dragon'); },
            emoji: '🐉',
            get description() { return t('desc_dragon'); },
            price: 5000,
            color: '#00ff88',
            glowColor: 'rgba(0,255,136,0.4)',
            accentColor: '#00cc66',
            darkColor: '#003311',
            maxHP: 150,
            speed: 5,
            energyGain: 0.012,
            shotCost: 3,
            superCost: 10,
            shotDamage: 30,
            shotSpeed: 10,
            shotSize: 6,
            shotCooldown: 25,
            superCooldown: 120,
            superDamage: 100,
            get attackDesc() { return t('atk_dragon'); },
            get superDesc() { return t('sup_dragon'); },
            hpRating: 7,
            speedRating: 4,
            damageRating: 10,
            fireShot: function (game, p) {
                AudioManager.playSound('plasma_dragon_shot');
                game.playerBullets.push({
                    x: p.x, y: p.y - p.height / 2,
                    vx: 0, vy: -this.shotSpeed,
                    size: this.shotSize, damage: this.shotDamage,
                    isSuper: false, life: 100, trail: [],
                    color: this.color
                });
                spawnParticles(p.x, p.y - p.height / 2, this.color, 7, 3);
            },
            fireSuper: function (game, p) {
                AudioManager.playSound('plasma_dragon_super');
                // Dragon breath: beam mode for 3 seconds
                p.beamMode = 180; // 3 seconds
                game.screenShake = 6;
                game.shakeIntensity = 5;
                spawnParticles(p.x, p.y - p.height / 2, '#00ff88', 20, 5);
                showMessage(t('msg_dragon_breath'), '#00ff88');
            },
            drawShip: function (ctx, p) {
                const thruster = Math.sin(p.thrusterPhase) * 0.3 + 0.7;

                // Engine glow
                const eg = ctx.createRadialGradient(0, p.height / 2 + 5, 0, 0, p.height / 2 + 5, 20 * thruster);
                eg.addColorStop(0, `rgba(0,255,136,${0.8 * thruster})`);
                eg.addColorStop(0.5, `rgba(0,170,85,${0.4 * thruster})`);
                eg.addColorStop(1, 'transparent');
                ctx.fillStyle = eg;
                ctx.fillRect(-20, p.height / 2 - 5, 40, 30);

                ctx.beginPath();
                ctx.moveTo(-8, p.height / 2);
                ctx.lineTo(0, p.height / 2 + 14 + 10 * thruster);
                ctx.lineTo(8, p.height / 2);
                ctx.fillStyle = `rgba(0,255,136,${0.7 * thruster})`;
                ctx.fill();

                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 18;

                // Scale-like angular body
                ctx.beginPath();
                ctx.moveTo(0, -p.height / 2 - 10);
                ctx.lineTo(-p.width / 4, -p.height / 4);
                ctx.lineTo(-p.width / 2 - 8, p.height / 4);
                ctx.lineTo(-p.width / 3, p.height / 2 - 5);
                ctx.lineTo(-p.width / 4, p.height / 4);
                ctx.lineTo(0, p.height / 2 + 5);
                ctx.lineTo(p.width / 4, p.height / 4);
                ctx.lineTo(p.width / 3, p.height / 2 - 5);
                ctx.lineTo(p.width / 2 + 8, p.height / 4);
                ctx.lineTo(p.width / 4, -p.height / 4);
                ctx.closePath();

                const grad = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
                grad.addColorStop(0, '#00ff88');
                grad.addColorStop(0.5, '#00cc66');
                grad.addColorStop(1, '#003311');
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.strokeStyle = '#55ffa5';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Eye
                ctx.beginPath();
                ctx.ellipse(0, -6, 3, 5, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ffaa00';
                ctx.fill();
            }
        }
    ];

    // ===== BOSS DEFINITIONS =====
    const BOSS_TYPES = [
        {
            name: "Zorgax", emoji: "👾", color: "#ff2d95",
            glowColor: "rgba(255,45,149,0.4)", baseHP: 280, speed: 3,
            attackRate: 55, pattern: "spread", size: 60,
            bulletColor: "#ff2d95", bulletSpeed: 5.5
        },
        {
            name: "Krypton", emoji: "🛸", color: "#00f5ff",
            glowColor: "rgba(0,245,255,0.4)", baseHP: 350, speed: 2.5,
            attackRate: 40, pattern: "spiral", size: 70,
            bulletColor: "#00f5ff", bulletSpeed: 5
        },
        {
            name: "Nebula", emoji: "🌀", color: "#7b2ff7",
            glowColor: "rgba(123,47,247,0.4)", baseHP: 320, speed: 4,
            attackRate: 35, pattern: "wave", size: 55,
            bulletColor: "#bf7bff", bulletSpeed: 6.5
        },
        {
            name: "Infernox", emoji: "🔥", color: "#ff6b35",
            glowColor: "rgba(255,107,53,0.4)", baseHP: 420, speed: 1.8,
            attackRate: 28, pattern: "burst", size: 80,
            bulletColor: "#ff6b35", bulletSpeed: 6
        },
        {
            name: "Glacius", emoji: "❄️", color: "#80dfff",
            glowColor: "rgba(128,223,255,0.4)", baseHP: 300, speed: 3.5,
            attackRate: 45, pattern: "rain", size: 58,
            bulletColor: "#80dfff", bulletSpeed: 4.5
        },
        {
            name: "Voidclaw", emoji: "🕳️", color: "#c850c0",
            glowColor: "rgba(200,80,192,0.4)", baseHP: 380, speed: 3,
            attackRate: 38, pattern: "homing", size: 65,
            bulletColor: "#c850c0", bulletSpeed: 4.5
        }
    ];

    // ===== SHOP ITEMS (in-game merchant) =====
    const SHOP_ITEMS = [
        {
            id: 'health_potion',
            get name() { return t('item_potion'); },
            emoji: '🧪',
            get description() { return t('desc_potion'); },
            price: 250,
            effect: (game) => {
                const p = game.player;
                p.hp = Math.min(p.maxHP, p.hp + Math.floor(p.maxHP * 0.25));
                showMessage(t('hp_restored'), '#ff2d55');
            }
        },
        {
            id: 'energy_crystal',
            get name() { return t('item_crystal'); },
            emoji: '💎',
            get description() { return t('desc_crystal'); },
            price: 350,
            effect: (game) => {
                game.player.energy = game.player.maxEnergy;
                showMessage(t('energy_full'), '#00f5ff');
            }
        },
        {
            id: 'shield_generator',
            get name() { return t('item_shield'); },
            emoji: '🛡️',
            get description() { return t('desc_shield'); },
            price: 600,
            effect: (game) => {
                if (game.player.energy >= 1) {
                    game.player.energy -= 1;
                    game.player.hasShield = true;
                    game.player.shieldTimer = 300;
                    AudioManager.playSound('powerup');
                    showMessage(t('shield_active'), '#7b2ff7', 2000);
                } else {
                    showMessage(t('insufficient'), '#ff0000', 500);
                }
            }
        }
    ];

    // ===== PERSISTENT DATA (localStorage) =====
    let persistentData = {
        totalCoins: 0,
        unlockedShips: ['star_hunter'],
        ownedShips: ['star_hunter'],
        selectedShip: 'star_hunter',
        touchMode: false,
        sfxEnabled: true,
        bgmEnabled: true,
        language: 'tr',
        upgrades: { hp: 0, speed: 0, damage: 0, energy: 0 },
        stats: { totalKills: 0, totalBosses: 0, totalGold: 0, maxWave: 0 },
        unlockedAchievements: []
    };

    const ACHIEVEMENT_LIST = [
        { id: 'rookie_pilot', icon: '🐣', get title() { return t('ach_first_kill'); }, get desc() { return t('ach_kills_desc'); }, goal: 100, stat: 'totalKills', reward: 200 },
        { id: 'boss_hunter', icon: '🎯', get title() { return t('ach_boss_slayer'); }, get desc() { return t('ach_boss_desc'); }, goal: 10, stat: 'totalBosses', reward: 1000 },
        { id: 'millionaire', icon: '💰', get title() { return t('ach_rich'); }, get desc() { return t('ach_gold_desc'); }, goal: 5000, stat: 'totalGold', reward: 500 },
        { id: 'veteran', icon: '🎗️', get title() { return t('ach_survivor'); }, get desc() { return t('ach_wave_desc'); }, goal: 10, stat: 'maxWave', reward: 500 }
    ];

    const UPGRADE_COSTS = [500, 1000, 2000, 4000, 8000];

    function saveData() {
        try {
            localStorage.setItem('uzaySavasi_data', JSON.stringify(persistentData));
        } catch (e) { /* ignore */ }
    }

    function loadData() {
        try {
            const saved = localStorage.getItem('uzaySavasi_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                persistentData = { ...persistentData, ...parsed };
                if (persistentData.sfxEnabled === undefined) persistentData.sfxEnabled = true;
                if (persistentData.bgmEnabled === undefined) persistentData.bgmEnabled = true;
                if (!persistentData.upgrades) persistentData.upgrades = { hp: 0, speed: 0, damage: 0, energy: 0 };
                if (!persistentData.stats) persistentData.stats = { totalKills: 0, totalBosses: 0, totalGold: 0, maxWave: 0 };
                if (!persistentData.unlockedAchievements) persistentData.unlockedAchievements = [];
            }
        } catch (e) { /* ignore */ }
    }

    function getSelectedShip() {
        return SHIP_TYPES.find(s => s.id === persistentData.selectedShip) || SHIP_TYPES[0];
    }

    // Load data on startup
    loadData();

    // ===== GAME STATE =====
    let game = {};
    let keys = {};
    let touchState = { joystickX: 0, joystickY: 0 };
    let animFrame;
    let messageTimeout;

    function initGame() {
        const w = canvas.width;
        const h = canvas.height;
        const ship = getSelectedShip();

        cacheShipHitMask(ship);

        game = {
            running: true,
            paused: false,
            score: 0,
            wave: 1,
            bossKills: 0,
            coins: 0,
            coinsEarnedThisRun: 0,
            bossHeads: [],
            combo: 0,
            comboTimer: 0,
            screenShake: 0,
            shakeIntensity: 0,

            player: {
                x: w / 2,
                y: h - 100,
                width: 40,
                height: 50,
                hp: ship.maxHP + (persistentData.upgrades.hp * 20),
                maxHP: ship.maxHP + (persistentData.upgrades.hp * 20),
                energy: 10 + (persistentData.upgrades.energy * 2),
                maxEnergy: 10 + (persistentData.upgrades.energy * 2),
                speed: ship.speed + (persistentData.upgrades.speed * 0.5),
                damageBonus: persistentData.upgrades.damage * 2,
                invincible: 0,
                damageReduction: 0,
                thrusterPhase: 0,
                hasShield: false,
                shieldTimer: 0,
                autoFire: 0,
                beamMode: 0,
                beamTickTimer: 0,
                doubleShot: 0,
                timeSlow: 0,
                magnet: 0
            },

            boss: null,
            playerBullets: [],
            bossBullets: [],
            particles: [],
            stars: [],
            powerups: [],
            explosions: [],
            damageNumbers: [],

            bossAttackTimer: 0,
            bossMoveDirX: 1,
            bossSpiralAngle: 0
        };

        // Generate stars
        for (let i = 0; i < STAR_COUNT; i++) {
            game.stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 1.5 + 0.3,
                brightness: Math.random() * 0.5 + 0.5
            });
        }

        // Update UI based on touch mode
        if (persistentData.touchMode) {
            hud.touchControls.classList.remove('hidden');
        } else {
            hud.touchControls.classList.add('hidden');
        }

        spawnBoss();
    }

    // ===== BOSS SPAWNING =====
    function spawnBoss() {
        const type = BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)];
        const hpMultiplier = 1 + (game.wave - 1) * 0.5;
        const maxHP = Math.floor(type.baseHP * hpMultiplier);

        game.boss = {
            ...type,
            x: canvas.width / 2,
            y: -80,
            maxHP: maxHP,
            hp: maxHP,
            entering: true,
            targetY: 80 + type.size / 2,
            angle: 0,
            phase: 0,
            attackCooldown: type.attackRate
        };
        game.bossAttackTimer = 0;
        game.bossSpiralAngle = 0;

        hud.bossName.textContent = `${type.emoji} ${type.name}`;
        showMessage(`⚠️ ${type.name} ${t('msg_incoming')}`, type.color);

        // Apply shield if bought
        if (game.player.hasShield) {
            game.player.invincible = 600;
            game.player.hasShield = false;
            showMessage(t('shield_active'), '#7b2ff7');
        }

        // Show dialogue
        const bossMsgs = {
            'Zorgax': t('zorgax_msg'),
            'Krypton': t('krypton_msg'),
            'Nebula': t('nebula_msg'),
            'Infernox': t('infernox_msg'),
            'Glacius': t('glacius_msg'),
            'Voidclaw': t('voidclaw_msg')
        };
        showDialogue(type.name, bossMsgs[type.name] || "...", type.emoji);
    }

    function showDialogue(name, text, emoji) {
        const container = $('dialogue-container');
        $('dialogue-name').textContent = name;
        $('dialogue-text').textContent = text;
        $('dialogue-emoji').textContent = emoji;
        container.classList.remove('hidden');
        container.classList.add('active');

        // Brief pause feel
        game.paused = true;
        setTimeout(() => {
            game.paused = false;
            setTimeout(() => {
                container.classList.remove('active');
                setTimeout(() => container.classList.add('hidden'), 500);
            }, 3000);
        }, 1500);
    }

    // ===== RESIZE =====
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // ===== INPUT =====
    window.addEventListener('keydown', e => {
        keys[e.code] = true;
        if (e.code === 'Space' || e.code === 'KeyZ') e.preventDefault();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    // Touch controls for mobile (Legacy / Background)
    let touchX = null;
    canvas.addEventListener('touchstart', e => {
        if (persistentData.touchMode) return; // Use explicit buttons in touch mode
        e.preventDefault();
        const touch = e.touches[0];
        touchX = touch.clientX;
        if (game.running) {
            const ship = getSelectedShip();
            if (game.player.energy >= ship.shotCost) {
                firePlayerShot(false);
            }
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
        if (persistentData.touchMode) return;
        e.preventDefault();
        if (touchX !== null) {
            const newX = e.touches[0].clientX;
            const dx = newX - touchX;
            game.player.x += dx;
            touchX = newX;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => { touchX = null; });

    // Explicit Touch Buttons for Smart Board
    const setupTouchButton = (btn, actionStart, actionEnd) => {
        if (!btn) return;
        ['touchstart', 'mousedown', 'pointerdown'].forEach(evt => {
            btn.addEventListener(evt, e => {
                e.preventDefault();
                actionStart();
            }, { passive: false });
        });
        ['touchend', 'mouseup', 'pointerup', 'pointerleave'].forEach(evt => {
            btn.addEventListener(evt, e => {
                e.preventDefault();
                actionEnd();
            }, { passive: false });
        });
    };

    // Joystick Implementation
    let joystickActive = false;
    let joystickStartPos = { x: 0, y: 0 };
    let joystickTouchId = null;
    const maxJoystickDistance = 40;

    function handleJoystickMove(e) {
        if (!joystickActive) return;

        let touch;
        if (e.touches) {
            for (let i = 0; i < e.touches.length; i++) {
                if (e.touches[i].identifier === joystickTouchId) {
                    touch = e.touches[i];
                    break;
                }
            }
            if (!touch) return;
        } else {
            touch = e;
        }

        let dx = touch.clientX - joystickStartPos.x;

        if (dx > maxJoystickDistance) dx = maxJoystickDistance;
        if (dx < -maxJoystickDistance) dx = -maxJoystickDistance;

        const moveX = dx;
        const moveY = 0; // Sadece X ekseninde hareket etsin

        hud.joystickKnob.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // Normalize joystick value (-1 to 1)
        touchState.joystickX = moveX / maxJoystickDistance;
        touchState.joystickY = 0;
    }

    function handleJoystickEnd(e) {
        if (!joystickActive) return;

        if (e && e.changedTouches) {
            let found = false;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === joystickTouchId) {
                    found = true;
                    break;
                }
            }
            if (!found) return; // Başka bir parmak kalktıysa yoksay
        }

        joystickActive = false;
        joystickTouchId = null;
        hud.joystickKnob.style.transform = 'translate(0, 0)';
        touchState.joystickX = 0;
        touchState.joystickY = 0;
    }

    hud.joystickContainer.addEventListener('touchstart', e => {
        e.preventDefault();
        if (joystickActive) return;

        joystickActive = true;
        const touch = e.changedTouches[0];
        joystickTouchId = touch.identifier;

        const rect = hud.joystickBase.getBoundingClientRect();
        joystickStartPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        handleJoystickMove(e);
    }, { passive: false });

    window.addEventListener('touchmove', handleJoystickMove, { passive: false });
    window.addEventListener('touchend', handleJoystickEnd);
    window.addEventListener('touchcancel', handleJoystickEnd);

    // Mouse support for joystick (testing)
    hud.joystickContainer.addEventListener('mousedown', e => {
        if (joystickActive) return;
        joystickActive = true;
        joystickTouchId = 'mouse';
        const rect = hud.joystickBase.getBoundingClientRect();
        joystickStartPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        handleJoystickMove(e);
    });
    window.addEventListener('mousemove', handleJoystickMove);
    window.addEventListener('mouseup', handleJoystickEnd);

    setupTouchButton(hud.btnShoot, () => { if (game.running && !game.paused) firePlayerShot(false); }, () => { });
    setupTouchButton(hud.btnSuper, () => { if (game.running && !game.paused) firePlayerShot(true); }, () => { });

    // Touch Mode Toggle
    function updateTouchModeUI() {
        if (persistentData.touchMode) {
            hud.touchModeBtn.classList.add('active');
            hud.touchModeBtn.querySelector('span').textContent = t('touch_on');
        } else {
            hud.touchModeBtn.classList.remove('active');
            hud.touchModeBtn.querySelector('span').textContent = t('touch_off');
        }
    }

    hud.touchModeBtn.addEventListener('click', () => {
        persistentData.touchMode = !persistentData.touchMode;
        saveData();
        updateTouchModeUI();
        showMessage(persistentData.touchMode ? t('msg_touch_on') : t('msg_touch_off'));
    });

    // Initialize UI
    updateTouchModeUI();

    // ===== PLAYER SHOOTING =====
    let shootCooldown = 0;
    let superCooldown = 0;

    function firePlayerShot(isSuper) {
        const p = game.player;
        const ship = getSelectedShip();

        if (isSuper) {
            if (p.energy < ship.superCost || superCooldown > 0) return;
            p.energy -= ship.superCost;
            superCooldown = ship.superCooldown;
            ship.fireSuper(game, p);
        } else {
            if (p.energy < ship.shotCost || shootCooldown > 0) return;
            p.energy -= ship.shotCost;
            shootCooldown = ship.shotCooldown;
            ship.fireShot(game, p);

            // Double shot powerup
            if (p.doubleShot > 0) {
                setTimeout(() => ship.fireShot(game, p), 100);
            }
        }
    }

    // ===== BOSS ATTACKS =====
    function bossAttack() {
        const b = game.boss;
        if (!b || b.entering) return;
        AudioManager.playSound('boss_shoot');

        const pattern = b.pattern;
        const speed = b.bulletSpeed + (game.wave - 1) * 0.4;

        switch (pattern) {
            case 'spread': {
                const count = 7 + Math.floor(game.wave / 2);
                const arc = Math.PI * 0.75;
                for (let i = 0; i < count; i++) {
                    const angle = -arc / 2 + (arc / (count - 1)) * i + Math.PI / 2;
                    game.bossBullets.push(makeBossBullet(b, Math.cos(angle) * speed, Math.sin(angle) * speed));
                }
                break;
            }
            case 'spiral': {
                const count = 4 + Math.floor(game.wave / 4);
                for (let i = 0; i < count; i++) {
                    const angle = game.bossSpiralAngle + (Math.PI * 2 / count) * i;
                    game.bossBullets.push(makeBossBullet(b, Math.cos(angle) * speed, Math.sin(angle) * speed));
                }
                game.bossSpiralAngle += 0.3;
                break;
            }
            case 'wave': {
                const amp = 3;
                for (let i = -2; i <= 2; i++) {
                    game.bossBullets.push(makeBossBullet(b, i * amp, speed));
                }
                break;
            }
            case 'burst': {
                const count = 12 + game.wave * 2;
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i;
                    game.bossBullets.push(makeBossBullet(b, Math.cos(angle) * speed, Math.sin(angle) * speed));
                }
                break;
            }
            case 'rain': {
                const count = 6 + game.wave;
                for (let i = 0; i < count; i++) {
                    const rx = b.x + (Math.random() - 0.5) * 200;
                    game.bossBullets.push({
                        x: rx,
                        y: b.y + b.size / 2,
                        vx: (Math.random() - 0.5) * 2,
                        vy: speed,
                        size: 5,
                        color: b.bulletColor,
                        life: 99999
                    });
                }
                break;
            }
            case 'homing': {
                const dx = game.player.x - b.x;
                const dy = game.player.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const nvx = (dx / dist) * speed;
                const nvy = (dy / dist) * speed;
                game.bossBullets.push(makeBossBullet(b, nvx, nvy));
                game.bossBullets.push(makeBossBullet(b, nvx + 2, nvy));
                game.bossBullets.push(makeBossBullet(b, nvx - 2, nvy));
                break;
            }
        }
    }

    function makeBossBullet(boss, vx, vy) {
        return {
            x: boss.x,
            y: boss.y + boss.size / 2,
            vx, vy,
            size: 5,
            color: boss.bulletColor,
            life: 99999
        };
    }

    // ===== PARTICLES =====
    function spawnParticles(x, y, color, count, speedMult) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * speedMult + 1;
            game.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                color,
                life: Math.random() * 30 + 20,
                maxLife: 50
            });
        }
    }

    function spawnExplosion(x, y, color, size) {
        game.explosions.push({
            x, y, color, size,
            life: 30,
            maxLife: 30
        });
        AudioManager.playSound('explosion');
        spawnParticles(x, y, color, 25, 6);
        spawnParticles(x, y, '#fff', 10, 4);
        game.screenShake = 10;
        game.shakeIntensity = 8;
    }

    function spawnDamageNumber(x, y, value, color) {
        game.damageNumbers.push({
            x, y, value, color,
            vy: -2,
            life: 40
        });
    }

    // ===== POWER-UPS =====
    function spawnPowerup(x, y) {
        const types = ['double_shot', 'time_slow', 'magnet', 'nuke'];
        const type = types[Math.floor(Math.random() * types.length)];
        const colors = {
            'double_shot': '#ffcc00',
            'time_slow': '#00f5ff',
            'magnet': '#ff00ff',
            'nuke': '#ff4400'
        };
        const emojis = {
            'double_shot': '⚡',
            'time_slow': '🌀',
            'magnet': '🧲',
            'nuke': '☢️'
        };

        game.powerups.push({
            x, y,
            type,
            color: colors[type],
            emoji: emojis[type],
            size: 20,
            vy: 2,
            angle: 0
        });
    }

    function applyPowerup(type) {
        const p = game.player;
        AudioManager.playSound('powerup');
        switch (type) {
            case 'double_shot':
                p.doubleShot = 360; // 6s
                showMessage(t('msg_double_shot'), '#ffcc00');
                break;
            case 'time_slow':
                p.timeSlow = 300; // 5s
                showMessage(t('msg_time_slow'), '#00f5ff');
                break;
            case 'magnet':
                p.magnet = 480; // 8s
                showMessage(t('msg_magnet'), '#ff00ff');
                break;
            case 'nuke':
                game.screenShake = 30;
                game.shakeIntensity = 15;
                if (game.boss && !game.boss.entering) {
                    game.boss.hp -= 60;
                    spawnDamageNumber(game.boss.x, game.boss.y, 100, '#ff4400');
                }
                game.bossBullets = [];
                showMessage(t('msg_nuke'), '#ff4400');
                break;
        }
    }

    // ===== MESSAGE DISPLAY =====
    function showMessage(text, color = '#00f5ff') {
        hud.messageDisplay.textContent = text;
        hud.messageDisplay.style.color = color;
        hud.messageDisplay.classList.remove('hidden');
        hud.messageDisplay.style.animation = 'none';
        hud.messageDisplay.offsetHeight; // reflow
        hud.messageDisplay.style.animation = 'msgFade 2s ease-out forwards';

        clearTimeout(messageTimeout);
        messageTimeout = setTimeout(() => {
            hud.messageDisplay.classList.add('hidden');
        }, 2000);
    }

    // ===== COLLISION =====
    function circlesCollide(a, b, r1, r2) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx * dx + dy * dy < (r1 + r2) * (r1 + r2);
    }

    const hitMaskCanvas = document.createElement('canvas');
    hitMaskCanvas.width = 100;
    hitMaskCanvas.height = 100;
    const hitMaskCtx = hitMaskCanvas.getContext('2d', { willReadFrequently: true });
    let hitMaskData = null;

    function cacheShipHitMask(ship) {
        hitMaskCtx.clearRect(0, 0, 100, 100);
        hitMaskCtx.save();
        hitMaskCtx.translate(50, 50);
        const fakePlayer = {
            width: 40, height: 50,
            thrusterPhase: 0,
            invincible: 0,
            beamMode: 0
        };
        ship.drawShip(hitMaskCtx, fakePlayer);
        hitMaskCtx.restore();
        hitMaskData = hitMaskCtx.getImageData(0, 0, 100, 100).data;
    }

    function checkPixelCollision(px, py, bx, by, bRadius) {
        if (!hitMaskData) return false;

        const relX = Math.round(bx - px + 50);
        const relY = Math.round(by - py + 50);
        const r = Math.ceil(bRadius);

        for (let y = relY - r; y <= relY + r; y++) {
            for (let x = relX - r; x <= relX + r; x++) {
                if (x >= 0 && x < 100 && y >= 0 && y < 100) {
                    if ((x - relX) * (x - relX) + (y - relY) * (y - relY) <= r * r) {
                        const alpha = hitMaskData[(y * 100 + x) * 4 + 3];
                        if (alpha > 200) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // ===== MERCHANT SYSTEM =====
    function openMerchant() {
        game.paused = true;
        game.merchantBoughtItems = [];
        renderMerchantUI();
        hud.merchantOverlay.classList.remove('hidden');
    }

    function closeMerchant() {
        game.paused = false;
        hud.merchantOverlay.classList.add('hidden');
        setTimeout(() => {
            if (game.running) spawnBoss();
        }, 800);
    }

    function renderMerchantUI() {
        hud.merchantCoins.textContent = game.coins;
        hud.headList.innerHTML = '';
        hud.shopList.innerHTML = '';

        if (game.bossHeads.length === 0) {
            hud.noHeads.style.display = 'block';
        } else {
            hud.noHeads.style.display = 'none';
            game.bossHeads.forEach((head, index) => {
                const card = document.createElement('div');
                card.className = 'head-card';
                card.innerHTML = `
                    <div class="head-info">
                        <span class="head-emoji">${head.emoji}</span>
                        <div>
                            <div class="head-name" style="color:${head.color}">${head.name}</div>
                            <div class="head-wave">${t('wave')} ${head.wave} • HP: ${head.maxHP}</div>
                        </div>
                    </div>
                    <button class="sell-btn" data-index="${index}">${t('sell')} 🪙${head.value}</button>
                `;
                hud.headList.appendChild(card);
            });

            hud.headList.querySelectorAll('.sell-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index);
                    const head = game.bossHeads[idx];
                    if (head) {
                        game.coins += head.value;
                        game.coinsEarnedThisRun += head.value;
                        game.bossHeads.splice(idx, 1);
                        renderMerchantUI();
                        updateCoinDisplay();
                    }
                });
            });
        }

        // Render Shop Items
        SHOP_ITEMS.forEach(item => {
            const card = document.createElement('div');
            card.className = 'head-card';
            const canAfford = game.coins >= item.price;
            const alreadyBoughtShield = item.id === 'shield_generator' && game.player.hasShield;
            const alreadyBoughtThisVisit = game.merchantBoughtItems && game.merchantBoughtItems.includes(item.id);
            const disabled = !canAfford || alreadyBoughtShield || alreadyBoughtThisVisit;

            card.innerHTML = `
                <div class="head-info">
                    <span class="head-emoji">${item.emoji}</span>
                    <div>
                        <div class="head-name">${item.name}</div>
                        <div class="head-wave">${item.description}</div>
                    </div>
                </div>
                <button class="buy-btn" data-id="${item.id}" ${disabled ? 'disabled' : ''}>
                    ${alreadyBoughtShield ? t('active') : alreadyBoughtThisVisit ? '✓' : `${t('buy')} 🪙${item.price}`}
                </button>
            `;
            hud.shopList.appendChild(card);
        });

        hud.shopList.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                const item = SHOP_ITEMS.find(i => i.id === itemId);
                if (item && game.coins >= item.price && !(game.merchantBoughtItems && game.merchantBoughtItems.includes(itemId))) {
                    game.coins -= item.price;
                    item.effect(game);
                    if (!game.merchantBoughtItems) game.merchantBoughtItems = [];
                    game.merchantBoughtItems.push(itemId);
                    renderMerchantUI();
                    updateCoinDisplay();
                }
            });
        });
    }

    // ===== LAB SYSTEM =====
    function openLab() {
        showScreen('lab');
        updateLabUI();
    }

    function updateLabUI() {
        $('lab-coins').textContent = persistentData.totalCoins;
        const grid = $('upgrade-grid');
        grid.innerHTML = '';

        const stats = [
            { id: 'hp', name: t('stat_hp'), icon: '❤️' },
            { id: 'speed', name: t('stat_speed'), icon: '🚀' },
            { id: 'damage', name: t('stat_damage'), icon: '💥' },
            { id: 'energy', name: t('stat_energy'), icon: '⚡' }
        ];

        stats.forEach(stat => {
            const level = persistentData.upgrades[stat.id];
            const cost = UPGRADE_COSTS[level] || null;
            const isMax = level >= 5;

            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="upgrade-info">
                    <span class="upgrade-name">${stat.icon} ${stat.name}</span>
                    <span class="upgrade-level">${t('level')} ${level}/5</span>
                </div>
                <div class="upgrade-bar-bg">
                    <div class="upgrade-bar-fill" style="width: ${level * 20}%"></div>
                </div>
                <div class="upgrade-action">
                    <span class="upgrade-cost">${isMax ? t('max') : '🪙 ' + cost}</span>
                    <button class="neon-btn upgrade-btn ${isMax ? 'maxed' : ''}" 
                        data-stat="${stat.id}" ${isMax || persistentData.totalCoins < cost ? 'disabled' : ''}>
                        ${isMax ? t('max') : t('upgrade')}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        grid.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const statId = btn.dataset.stat;
                const level = persistentData.upgrades[statId];
                const cost = UPGRADE_COSTS[level];
                if (persistentData.totalCoins >= cost) {
                    persistentData.totalCoins -= cost;
                    persistentData.upgrades[statId]++;
                    saveData();
                    AudioManager.playSound('btn_click');
                    updateLabUI();
                    updateMenuUI();
                }
            });
        });
    }

    // ===== ACHIEVEMENTS SYSTEM =====
    function openAchievements() {
        showScreen('achievements');
        updateAchievementsUI();
    }

    function updateAchievementsUI() {
        $('stat-kills').textContent = persistentData.stats.totalKills;
        $('stat-bosses').textContent = persistentData.stats.totalBosses;
        const list = $('achievements-list');
        list.innerHTML = '';

        ACHIEVEMENT_LIST.forEach(ach => {
            const current = persistentData.stats[ach.stat] || 0;
            const isUnlocked = current >= ach.goal;
            const isClaimed = persistentData.unlockedAchievements.includes(ach.id);

            const item = document.createElement('div');
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            item.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-details">
                    <div class="achievement-title">${ach.title}</div>
                    <div class="achievement-desc">${ach.desc} (${Math.min(current, ach.goal)}/${ach.goal})</div>
                </div>
                ${isUnlocked && !isClaimed ? `<button class="neon-btn claim-btn" data-id="${ach.id}">🎁 ${ach.reward}</button>` : ''}
                ${isClaimed ? '<span class="claimed-check">✅</span>' : ''}
            `;
            list.appendChild(item);
        });

        list.querySelectorAll('.claim-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const ach = ACHIEVEMENT_LIST.find(a => a.id === id);
                if (ach && !persistentData.unlockedAchievements.includes(id)) {
                    persistentData.totalCoins += ach.reward;
                    persistentData.unlockedAchievements.push(id);
                    saveData();
                    AudioManager.playSound('crystal');
                    updateAchievementsUI();
                    updateMenuUI();
                }
            });
        });
    }

    function updateCoinDisplay() {
        hud.coins.textContent = game.coins;
        hud.merchantCoins.textContent = game.coins;
    }

    // ===== UPDATE =====
    function update() {
        if (game.paused) return;
        const p = game.player;
        const b = game.boss;
        const W = canvas.width;
        const H = canvas.height;
        const ship = getSelectedShip();

        // --- Player Movement ---
        if (keys['ArrowLeft'] || keys['KeyA']) p.x -= p.speed;
        if (keys['ArrowRight'] || keys['KeyD']) p.x += p.speed;

        // Joystick movement
        if (persistentData.touchMode && Math.abs(touchState.joystickX) > 0.1) {
            p.x += touchState.joystickX * p.speed;
        }

        p.x = Math.max(p.width / 2, Math.min(W - p.width / 2, p.x));

        // --- Energy Regen ---
        p.energy = Math.min(p.maxEnergy, p.energy + ship.energyGain);

        // --- Shooting ---
        if (shootCooldown > 0) shootCooldown--;
        if (superCooldown > 0) superCooldown--;
        if (keys['Space']) firePlayerShot(false);
        if (keys['KeyZ']) firePlayerShot(true);

        // --- Shield logic ---
        if (p.shieldTimer > 0) {
            p.shieldTimer--;
            if (p.shieldTimer <= 0) p.hasShield = false;
        }

        // --- Auto-fire (Ghost Blade ulti) ---
        if (p.autoFire > 0) {
            p.autoFire--;
            if (p.autoFire % 6 === 0) {
                ship.fireShot(game, p);
            }
        }

        // --- Beam mode (Plasma Dragon ulti) ---
        if (p.beamMode > 0) {
            p.beamMode--;
            p.beamTickTimer++;
            // Deal 20% of boss current HP every 60 frames (1 second)
            if (b && !b.entering) {
                const beamHitDist = Math.abs(b.x - p.x);
                if (beamHitDist < b.size + 30) {
                    if (p.beamTickTimer % 60 === 0) {
                        const tickDmg = Math.floor(b.hp * 0.20);
                        b.hp -= tickDmg;
                        spawnDamageNumber(b.x, b.y - 20, tickDmg, '#00ff88');
                        game.screenShake = 4;
                        game.shakeIntensity = 3;
                    }
                    if (game.particles.length < 200) {
                        spawnParticles(b.x, b.y + b.size / 2, '#00ff88', 2, 2);
                    }
                }
            }
        } else {
            p.beamTickTimer = 0;
        }

        // --- Powerup Timers ---
        if (p.doubleShot > 0) p.doubleShot--;
        if (p.timeSlow > 0) p.timeSlow--;
        if (p.magnet > 0) {
            p.magnet--;
            // Pull all boss bullets away? No, pull coins!
            // Wait, coins are not separate objects yet, they are added to `game.coins` when head is sold.
            // Let's make the magnet pull "ghost coins" that spawn sometimes?
            // Actually, let's make it pull Boss Heads if they were physical objects.
            // For now, let's make Magnet give a bonus to gold earned.
        }

        // --- Invincibility ---
        if (p.invincible > 0) p.invincible--;
        if (p.damageReduction > 0) p.damageReduction--;
        p.thrusterPhase += 0.15;

        // --- Stars ---
        game.stars.forEach(s => {
            s.y += s.speed;
            if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
        });

        // --- Boss Logic ---
        if (b) {
            if (b.entering) {
                b.y += 2;
                if (b.y >= b.targetY) {
                    b.entering = false;
                    b.y = b.targetY;
                }
            } else {
                b.x += b.speed * game.bossMoveDirX;
                if (b.x < b.size + 30 || b.x > W - b.size - 30) {
                    game.bossMoveDirX *= -1;
                }
                b.angle += 0.02;
                b.y = b.targetY + Math.sin(b.angle) * 15;

                game.bossAttackTimer++;
                if (game.bossAttackTimer >= b.attackCooldown) {
                    bossAttack();
                    game.bossAttackTimer = 0;
                }

                // Check boss death from beam/shockwave
                if (b.hp <= 0) {
                    onBossDefeated(b, p);
                }
            }
        }

        // --- Player Bullets ---
        game.playerBullets.forEach(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;

            bullet.trail.push({ x: bullet.x, y: bullet.y, life: 8 });
            if (bullet.trail.length > 8) bullet.trail.shift();
            bullet.trail.forEach(t => t.life--);

            if (b && !b.entering && circlesCollide(bullet, b, bullet.size, b.size)) {
                AudioManager.playSound('hit');
                b.hp -= bullet.damage;
                bullet.life = 0;
                spawnParticles(bullet.x, bullet.y, b.color, 8, 3);
                spawnDamageNumber(bullet.x, bullet.y - 20, bullet.damage, ship.color);
                game.score += bullet.damage;
                game.screenShake = 3;
                game.shakeIntensity = 2;

                game.combo++;
                game.comboTimer = 60;

                if (game.combo >= 10 && game.combo % 10 === 0) {
                    showMessage(t('serial_killer'), '#ff2d55', 2000);
                    game.player.energy = Math.min(game.player.maxEnergy, game.player.energy + 2);
                } else if (game.combo >= 5 && game.combo % 5 === 0) {
                    showMessage(t('perfect'), '#00ff88');
                    game.player.energy = Math.min(game.player.maxEnergy, game.player.energy + 1);
                } else if (game.combo >= 3 && game.combo % 3 === 0) {
                    showMessage(t('good'), '#ffff00');
                }

                // Random powerup drop
                if (Math.random() < 0.06) {
                    spawnPowerup(bullet.x, bullet.y);
                }

                if (b.hp <= 0) {
                    onBossDefeated(b, p);
                }
            }
        });
        game.playerBullets = game.playerBullets.filter(b => b.life > 0);

        // --- Boss Bullets ---
        game.bossBullets.forEach(bullet => {
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            bullet.life--;

            if (p.invincible <= 0 && circlesCollide(bullet, p, bullet.size, 35)) {
                if (checkPixelCollision(p.x, p.y, bullet.x, bullet.y, bullet.size)) {
                    if (p.hasShield) {
                        p.hasShield = false;
                        p.shieldTimer = 0;
                        p.invincible = 60;
                        AudioManager.playSound('shield_break');
                        showMessage(t('shield_broken'), '#ffffff');
                    } else {
                        AudioManager.playSound('hit');
                        let dmg = 14 + Math.floor(game.wave * 2.5);
                        // Ghost Blade ulti: %30 damage reduction
                        if (p.damageReduction > 0) {
                            dmg = Math.floor(dmg * 0.7);
                        }
                        p.hp -= dmg;
                        bullet.life = 0;
                        p.invincible = 18;
                        spawnParticles(p.x, p.y, '#ff2d55', 12, 4);
                        spawnDamageNumber(p.x, p.y - 30, dmg, '#ff2d55');
                        game.screenShake = 6;
                        game.shakeIntensity = 5;
                        game.combo = 0;

                        if (p.hp <= 0) {
                            gameOver();
                            return;
                        }
                    }
                }
            }
        });
        game.bossBullets = game.bossBullets.filter(b => b.life > 0 && b.y < H + 20 && b.y > -20 && b.x > -20 && b.x < W + 20);

        // --- Particles ---
        game.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.life--;
        });
        game.particles = game.particles.filter(p => p.life > 0);

        // --- Explosions ---
        game.explosions.forEach(e => e.life--);
        game.explosions = game.explosions.filter(e => e.life > 0);

        // --- Damage Numbers ---
        game.damageNumbers.forEach(d => {
            d.y += d.vy;
            d.life--;
        });
        game.damageNumbers = game.damageNumbers.filter(d => d.life > 0);

        // --- Screen Shake ---
        if (game.screenShake > 0) game.screenShake--;

        // --- Combo Timer ---
        if (game.comboTimer > 0) {
            game.comboTimer--;
            if (game.comboTimer <= 0) game.combo = 0;
        }

        updateHUD();
    }

    // ===== BOSS DEFEATED =====
    function onBossDefeated(b, p) {
        if (!b || b._defeated) return;
        b._defeated = true;

        const ship = getSelectedShip();
        spawnExplosion(b.x, b.y, b.color, b.size * 2);
        const bonusScore = 500 * game.wave;
        game.score += bonusScore;
        game.bossKills++;
        showMessage(`${t('msg_boss_dead')} ${b.name}! +${bonusScore}`, '#00ff88');

        const headValue = Math.floor(20 + b.maxHP * 0.15 + game.wave * 8);
        game.bossHeads.push({
            name: b.name,
            emoji: b.emoji,
            color: b.color,
            wave: game.wave,
            maxHP: b.maxHP,
            value: headValue
        });

        game.wave++;
        p.energy = Math.min(p.maxEnergy, p.energy + 3);
        p.beamMode = 0;
        p.doubleShot = 0;
        p.timeSlow = 0;
        p.magnet = 0;

        // Update persistent stats
        persistentData.stats.totalBosses++;
        persistentData.stats.totalGold = (persistentData.totalCoins + game.coinsEarnedThisRun);
        if (game.wave > persistentData.stats.maxWave) persistentData.stats.maxWave = game.wave;
        saveData();

        game.boss = null;
        game.bossBullets = [];

        setTimeout(() => {
            if (game.running) openMerchant();
        }, 1500);
    }

    // ===== UPDATE HUD =====
    function updateHUD() {
        const p = game.player;
        const b = game.boss;
        const ship = getSelectedShip();

        const hpPercent = Math.max(0, p.hp / p.maxHP * 100);
        hud.healthBar.style.width = hpPercent + '%';
        hud.healthText.textContent = Math.max(0, Math.ceil(p.hp));

        const energyPercent = p.energy / p.maxEnergy * 100;
        hud.energyBar.style.width = energyPercent + '%';
        hud.energyText.textContent = p.energy.toFixed(1).replace('.', ',');

        if (b) {
            const bossPercent = Math.max(0, b.hp / b.maxHP * 100);
            hud.bossHealthBar.style.width = bossPercent + '%';
        } else {
            hud.bossHealthBar.style.width = '0%';
        }

        hud.score.textContent = game.score;
        hud.wave.textContent = game.wave;

        if (game.combo >= 3) {
            hud.comboDisplay.classList.remove('hidden');
            hud.comboDisplay.textContent = `${game.combo}x ${t('combo')}`;
            hud.comboDisplay.style.color = game.combo >= 10 ? '#ff2d95' : game.combo >= 5 ? '#ffaa00' : '#00f5ff';
            hud.comboDisplay.style.textShadow = `0 0 30px ${hud.comboDisplay.style.color}`;
        } else {
            hud.comboDisplay.classList.add('hidden');
        }
    }

    // ===== DRAW =====
    function draw() {
        const W = canvas.width;
        const H = canvas.height;

        ctx.save();

        if (game.screenShake > 0) {
            const sx = (Math.random() - 0.5) * game.shakeIntensity;
            const sy = (Math.random() - 0.5) * game.shakeIntensity;
            ctx.translate(sx, sy);
        }

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#0a0015');
        bgGrad.addColorStop(0.5, '#0d0025');
        bgGrad.addColorStop(1, '#05001a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Stars
        game.stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 220, 255, ${s.brightness})`;
            ctx.fill();
        });

        // --- Explosions ---
        game.explosions.forEach(e => {
            const progress = 1 - e.life / e.maxLife;
            const radius = e.size * progress;
            const alpha = 1 - progress;

            const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius);
            grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
            grad.addColorStop(0.3, e.color + Math.floor(alpha * 180).toString(16).padStart(2, '0'));
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(e.x - radius, e.y - radius, radius * 2, radius * 2);
        });

        // --- Boss ---
        const b = game.boss;
        if (b) {
            drawBoss(b);
        }

        // --- Boss Bullets ---
        game.bossBullets.forEach(bullet => {
            ctx.save();
            ctx.shadowColor = bullet.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            ctx.fillStyle = bullet.color;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.restore();
        });

        // --- Player Bullets ---
        game.playerBullets.forEach(bullet => {
            bullet.trail.forEach((t, i) => {
                const alpha = t.life / 8;
                ctx.beginPath();
                ctx.arc(t.x, t.y, bullet.size * 0.6 * alpha, 0, Math.PI * 2);
                const bulletColor = bullet.color || '#00f5ff';
                ctx.fillStyle = bullet.isSuper
                    ? `rgba(123,47,247,${alpha * 0.6})`
                    : hexToRgba(bulletColor, alpha * 0.5);
                ctx.fill();
            });

            ctx.save();
            ctx.shadowColor = bullet.isSuper ? '#7b2ff7' : (bullet.color || '#00f5ff');
            ctx.shadowBlur = bullet.isSuper ? 20 : 12;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            ctx.fillStyle = bullet.isSuper ? '#bf7bff' : (bullet.color || '#00f5ff');
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.restore();
        });

        // --- Plasma Dragon Beam Visual ---
        if (game.player.beamMode > 0) {
            const p = game.player;
            const beamWidth = 18 + Math.sin(Date.now() * 0.02) * 6;
            const beamX = p.x;
            const beamTopY = 0;
            const beamBottomY = p.y - p.height / 2;

            // Outer glow
            ctx.save();
            const beamGrad = ctx.createLinearGradient(beamX - beamWidth * 2, 0, beamX + beamWidth * 2, 0);
            beamGrad.addColorStop(0, 'transparent');
            beamGrad.addColorStop(0.3, 'rgba(0,255,136,0.1)');
            beamGrad.addColorStop(0.5, 'rgba(0,255,136,0.3)');
            beamGrad.addColorStop(0.7, 'rgba(0,255,136,0.1)');
            beamGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = beamGrad;
            ctx.fillRect(beamX - beamWidth * 2, beamTopY, beamWidth * 4, beamBottomY - beamTopY);

            // Core beam
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 30;
            const coreGrad = ctx.createLinearGradient(beamX - beamWidth / 2, 0, beamX + beamWidth / 2, 0);
            coreGrad.addColorStop(0, 'rgba(0,255,136,0.05)');
            coreGrad.addColorStop(0.3, 'rgba(0,255,136,0.7)');
            coreGrad.addColorStop(0.5, 'rgba(200,255,220,0.95)');
            coreGrad.addColorStop(0.7, 'rgba(0,255,136,0.7)');
            coreGrad.addColorStop(1, 'rgba(0,255,136,0.05)');
            ctx.fillStyle = coreGrad;
            ctx.fillRect(beamX - beamWidth / 2, beamTopY, beamWidth, beamBottomY - beamTopY);

            // Bright center line
            ctx.beginPath();
            ctx.moveTo(beamX, beamTopY);
            ctx.lineTo(beamX, beamBottomY);
            ctx.strokeStyle = `rgba(255,255,255,${0.6 + Math.sin(Date.now() * 0.03) * 0.3})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Impact flash on boss
            if (game.boss && !game.boss.entering) {
                const bDist = Math.abs(game.boss.x - beamX);
                if (bDist < game.boss.size + 30) {
                    const impactGrad = ctx.createRadialGradient(beamX, game.boss.y, 0, beamX, game.boss.y, 40);
                    impactGrad.addColorStop(0, 'rgba(200,255,220,0.8)');
                    impactGrad.addColorStop(0.4, 'rgba(0,255,136,0.4)');
                    impactGrad.addColorStop(1, 'transparent');
                    ctx.fillStyle = impactGrad;
                    ctx.fillRect(beamX - 40, game.boss.y - 40, 80, 80);
                }
            }
            ctx.restore();
        }

        // --- Player ---
        drawPlayer();

        // --- Particles ---
        game.particles.forEach(p => {
            const alpha = p.life / p.maxLife;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(alpha * 200).toString(16).padStart(2, '0');
            ctx.fill();
        });

        // --- Damage Numbers ---
        game.damageNumbers.forEach(d => {
            const alpha = d.life / 40;
            ctx.save();
            ctx.font = `bold ${16 + d.value / 2}px Orbitron, sans-serif`;
            ctx.fillStyle = d.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.shadowColor = d.color;
            ctx.shadowBlur = 8;
            ctx.textAlign = 'center';
            ctx.fillText(`-${d.value}`, d.x, d.y);
            ctx.restore();
        });

        ctx.restore();
    }

    // ===== HELPER: hex to rgba =====
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    // ===== DRAW PLAYER =====
    function drawPlayer() {
        const p = game.player;
        const ship = getSelectedShip();
        const blinkOn = p.invincible > 0 ? Math.floor(p.invincible / 3) % 2 === 0 : true;
        if (!blinkOn) return;

        ctx.save();
        ctx.translate(p.x, p.y);

        ship.drawShip(ctx, p);

        ctx.restore();

        // Shield visual
        if (p.hasShield) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 35, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(123,47,247,${0.3 + Math.sin(p.thrusterPhase * 3) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    }

    // ===== DRAW BOSS =====
    function drawBoss(b) {
        ctx.save();
        ctx.translate(b.x, b.y);

        const auraGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size * 1.5);
        auraGrad.addColorStop(0, b.glowColor);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.fillRect(-b.size * 1.5, -b.size * 1.5, b.size * 3, b.size * 3);

        const damaged = b.hp < b.maxHP * 0.3;
        const flashAlpha = damaged ? 0.3 + Math.sin(Date.now() * 0.01) * 0.2 : 0;

        ctx.shadowColor = b.color;
        ctx.shadowBlur = 25;

        const sides = 6;
        const rot = b.angle * 0.5;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (Math.PI * 2 / sides) * i + rot;
            const r = b.size * (0.9 + Math.sin(b.angle + i) * 0.1);
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const bodyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, b.size);
        bodyGrad.addColorStop(0, '#fff');
        bodyGrad.addColorStop(0.3, b.color);
        bodyGrad.addColorStop(1, '#111');
        ctx.fillStyle = bodyGrad;
        ctx.fill();
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = b.color + '88';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = b.color + 'aa';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.05, 0, Math.PI * 2);
        ctx.fillStyle = '#000';
        ctx.fill();

        for (let i = 0; i < 4; i++) {
            const baseAngle = (Math.PI * 2 / 4) * i + rot * 0.5 + Math.PI / 4;
            const x1 = Math.cos(baseAngle) * b.size * 0.8;
            const y1 = Math.sin(baseAngle) * b.size * 0.8;
            const wiggle = Math.sin(b.angle * 2 + i * 1.5) * 15;
            const x2 = Math.cos(baseAngle) * (b.size * 1.3) + Math.cos(baseAngle + Math.PI / 2) * wiggle;
            const y2 = Math.sin(baseAngle) * (b.size * 1.3) + Math.sin(baseAngle + Math.PI / 2) * wiggle;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(
                (x1 + x2) / 2 + wiggle * 0.5,
                (y1 + y2) / 2 + wiggle * 0.5,
                x2, y2
            );
            ctx.strokeStyle = b.color + 'cc';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x2, y2, 4, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
        }

        if (flashAlpha > 0) {
            ctx.globalAlpha = flashAlpha;
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI * 2 / sides) * i + rot;
                const r = b.size;
                const px = Math.cos(angle) * r;
                const py = Math.sin(angle) * r;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fillStyle = '#ff0000';
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        ctx.font = `${b.size * 0.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.emoji, 0, -b.size - 15);

        ctx.restore();
    }

    // ===== GAME LOOP =====
    function gameLoop() {
        if (!game.running) return;
        update();
        draw();
        animFrame = requestAnimationFrame(gameLoop);
    }

    // ===== SCREEN MANAGEMENT =====
    function showScreen(name) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[name].classList.add('active');
    }

    function updateMenuUI() {
        const ship = getSelectedShip();
        $('menu-ship-icon').textContent = ship.emoji;
        $('menu-ship-name').textContent = ship.name;
        $('menu-coins').textContent = persistentData.totalCoins;
    }

    function startGame() {
        showScreen('game');
        resize();
        initGame();
        AudioManager.playBGM();
        gameLoop();
    }

    function gameOver() {
        game.running = false;
        cancelAnimationFrame(animFrame);
        AudioManager.stopBGM();
        AudioManager.playSound('gameover');

        // Save coins to persistent storage
        persistentData.totalCoins += game.coinsEarnedThisRun;
        saveData();

        $('final-score').textContent = game.score;
        $('final-wave').textContent = game.wave;
        $('final-kills').textContent = game.bossKills;
        $('final-coins-earned').textContent = game.coinsEarnedThisRun;

        setTimeout(() => showScreen('over'), 500);
    }

    function goToMenu() {
        updateMenuUI();
        showScreen('start');
    }

    // ===== HANGAR SYSTEM =====
    function openHangar() {
        updateHangarUI();
        showScreen('hangar');
    }

    function updateHangarUI() {
        $('hangar-coins').textContent = persistentData.totalCoins;
        const grid = $('ship-grid');
        grid.innerHTML = '';

        SHIP_TYPES.forEach(ship => {
            const isOwned = persistentData.ownedShips.includes(ship.id);
            const isSelected = persistentData.selectedShip === ship.id;
            const canAfford = persistentData.totalCoins >= ship.price;

            const card = document.createElement('div');
            card.className = `ship-card${isSelected ? ' selected' : ''}${!isOwned ? ' locked' : ''}`;

            card.innerHTML = `
                ${!isOwned ? '<div class="ship-lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
                <div class="ship-card-header">
                    <div class="ship-preview">
                        <canvas data-ship-id="${ship.id}" width="56" height="56"></canvas>
                    </div>
                    <div>
                        <div class="ship-card-title" style="color:${ship.color}">${ship.emoji} ${ship.name}</div>
                        <div class="ship-card-subtitle">${ship.description}</div>
                    </div>
                </div>
                <div class="ship-stats">
                    <div class="ship-stat">
                        <span class="ship-stat-label">❤️ CAN</span>
                        <div class="ship-stat-bar"><div class="ship-stat-fill hp" style="width:${ship.hpRating * 10}%"></div></div>
                    </div>
                    <div class="ship-stat">
                        <span class="ship-stat-label">⚡ HIZ</span>
                        <div class="ship-stat-bar"><div class="ship-stat-fill speed" style="width:${ship.speedRating * 10}%"></div></div>
                    </div>
                    <div class="ship-stat">
                        <span class="ship-stat-label">💥 HASAR</span>
                        <div class="ship-stat-bar"><div class="ship-stat-fill damage" style="width:${ship.damageRating * 10}%"></div></div>
                    </div>
                </div>
                <div class="ship-abilities">
                    <div class="ship-ability"><span class="ability-key">SPACE</span> ${ship.attackDesc}</div>
                    <div class="ship-ability"><span class="ability-key">Z</span> ${ship.superDesc}</div>
                </div>
                <div class="ship-card-action"><button class="buy-btn"></button></div>
            `;

            grid.appendChild(card);

            // Setup button state
            const buyBtn = card.querySelector('.buy-btn');
            if (isOwned) {
                if (isSelected) {
                    buyBtn.innerHTML = t('selected_btn');
                    buyBtn.classList.add('selected');
                } else {
                    buyBtn.innerHTML = t('select_btn');
                    buyBtn.classList.add('owned');
                    buyBtn.onclick = () => {
                        persistentData.selectedShip = ship.id;
                        saveData();
                        AudioManager.playSound('btn_click');
                        updateHangarUI();
                    };
                }
            } else {
                buyBtn.innerHTML = t('buy_btn').replace('{price}', ship.price);
                if (!canAfford) buyBtn.disabled = true;
                buyBtn.onclick = () => {
                    persistentData.totalCoins -= ship.price;
                    persistentData.ownedShips.push(ship.id);
                    persistentData.selectedShip = ship.id;
                    saveData();
                    AudioManager.playSound('btn_click');
                    updateHangarUI();
                };
            }

            // Draw ship preview on mini canvas
            setTimeout(() => {
                const miniCanvas = card.querySelector(`canvas[data-ship-id="${ship.id}"]`);
                if (miniCanvas) {
                    drawShipPreview(miniCanvas, ship);
                }
            }, 50);
        });
    }

    function drawShipPreview(miniCanvas, ship) {
        const mCtx = miniCanvas.getContext('2d');
        mCtx.clearRect(0, 0, 56, 56);
        mCtx.save();
        mCtx.translate(28, 30);
        mCtx.scale(0.55, 0.55);

        const fakePlayer = {
            x: 0, y: 0,
            width: 40, height: 50,
            thrusterPhase: Date.now() * 0.003,
            invincible: 0,
            beamMode: 0
        };

        ship.drawShip(mCtx, fakePlayer);
        mCtx.restore();
    }

    // Animate ship previews
    function animateHangarPreviews() {
        if (!screens.hangar.classList.contains('active')) return;
        SHIP_TYPES.forEach(ship => {
            const miniCanvas = document.querySelector(`canvas[data-ship-id="${ship.id}"]`);
            if (miniCanvas) {
                drawShipPreview(miniCanvas, ship);
            }
        });
        requestAnimationFrame(animateHangarPreviews);
    }

    // ===== EVENT LISTENERS =====
    $('start-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); startGame(); });
    $('restart-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); startGame(); });
    $('menu-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); goToMenu(); });
    $('hangar-btn').addEventListener('click', () => {
        AudioManager.playSound('btn_click');
        openHangar();
        animateHangarPreviews();
    });
    $('hangar-back-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); goToMenu(); });
    $('lab-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); openLab(); });
    $('lab-back-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); goToMenu(); });
    $('achievements-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); openAchievements(); });
    $('achievements-back-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); goToMenu(); });
    $('merchant-close-btn').addEventListener('click', () => { AudioManager.playSound('btn_click'); closeMerchant(); });

    function updateSettingsUI() {
        $('toggle-sfx-btn').querySelector('span').textContent = persistentData.sfxEnabled ? t('sfx_on') : t('sfx_off');
        $('toggle-bgm-btn').querySelector('span').textContent = persistentData.bgmEnabled ? t('bgm_on') : t('bgm_off');
    }

    $('settings-open-btn').addEventListener('click', () => {
        AudioManager.playSound('btn_click');
        updateSettingsUI();
        showScreen('settings');
    });

    $('settings-close-btn').addEventListener('click', () => {
        AudioManager.playSound('btn_click');
        showScreen('start');
    });

    $('toggle-sfx-btn').addEventListener('click', () => {
        persistentData.sfxEnabled = !persistentData.sfxEnabled;
        saveData();
        updateSettingsUI();
        AudioManager.playSound('btn_click');
    });

    $('toggle-bgm-btn').addEventListener('click', () => {
        persistentData.bgmEnabled = !persistentData.bgmEnabled;
        saveData();
        AudioManager.playSound('btn_click');
        if (persistentData.bgmEnabled) {
            AudioManager.playBGM();
        } else {
            AudioManager.stopBGM();
        }
        updateSettingsUI();
    });

    $('language-select')?.addEventListener('change', (e) => {
        persistentData.language = e.target.value;
        saveData();
        AudioManager.playSound('btn_click');
        applyLanguage();
        updateSettingsUI();
        updateMenuUI();
    });

    const resetBtn = $('reset-progress-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            const msg = t('confirm_reset') || "Sıfırlansın mı?";
            if (window.confirm(msg)) {
                localStorage.removeItem('uzaySavasi_data');
                window.location.reload();
            }
        };
    }

    // Start with keyboard too
    window.addEventListener('keydown', e => {
        if (e.code === 'Enter' || e.code === 'Space') {
            if (screens.start.classList.contains('active')) {
                e.preventDefault();
                startGame();
            } else if (screens.over.classList.contains('active')) {
                e.preventDefault();
                startGame();
            }
        }
    });

    // Initialize menu on load
    applyLanguage();
    updateMenuUI();
})();
