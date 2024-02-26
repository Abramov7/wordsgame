class LoadScene extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    data;
    word;
    score=0;
    timeLeft=20;
    scoreText;
    timerText;
    inUse=[];

    preload()
    {
        this.load.json('jsonData', 'assets/words_dictionary.json')
    }
    

    create(){
        this.bg = this.add.graphics({fillStyle: { color: 0xE2CB7C}, lineStyle: {width: 12, color: 0x1B1F1D}});
        
        const rect = new Phaser.Geom.Rectangle(0, 0, config.width, config.height)
        const trect = new Phaser.Geom.Rectangle(25, 25, config.width-50, config.height-50)
        
        this.bg.fillRectShape(rect)
        this.bg.strokeRectShape(trect)

        //tween targets for scoreText and timerText
        this.plusScore = this.add.text(150, config.height-75, '', {font: '32px GillSans', fill: '#1b1f1d'});
        this.plusTimer = this.add.text(config.width-110, config.height-75, '', {font: '32px GillSans', fill: '#1b1f1d'})
        

        this.data = Object.keys(this.cache.json.get('jsonData'));
        this.winText = this.add.text(config.width / 2 - 75, config.height / 2 - 10, 'Correct!', {fill: '#326d42', font: '48px GillSans'})
        this.winText.alpha = 0;
        this.plusScore.alpha = 0;
        this.plusTimer.alpha = 0;
        this.enemyText = this.add.text(config.width/2 -125, config.height/2 -100, 'TEST', { font: '48px GillSans', fill: '#1b1f1d'})
        this.add.text(config.width/2 - 75, config.height/2 - 40, 'your turn...', {font: '24px GillSans', fill: '#932443'})
        this.textEntry = this.add.text(config.width/2 - 50, config.height/2 - 10, '', { font: '48px GillSans', fill: '#1b1f1d' });
        this.word = this.data[Phaser.Math.Between(0, this.data.length)]
        this.scoreText = this.add.text(50, config.height-75, 'SCORE - 0', {font: '32px GillSans', fill: '#1b1f1d'});
        this.timerText = this.add.text(config.width-273, config.height-75, 'TIME LEFT - 0', {font: '32px GillSans', fill: '#1b1f1d'});
        this.enemyText.text = this.word
        

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        })

        this.input.keyboard.on('keydown', event =>
        {

            if (event.keyCode === 8 && this.textEntry.text.length > 0)
            {
                this.textEntry.text = this.textEntry.text.substr(0, this.textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
            {
                this.textEntry.text += event.key;
            }
            else if (event.keyCode === 13)
            {
                this.pickWord(this.textEntry.text)
            }

        });
    }

    updateTimer(){
        this.timeLeft -= 1;
        this.timerText.text = 'TIME LEFT - '+this.timeLeft
    }

    addScore(amount){
        this.score += amount;
        this.scoreText.text = 'SCORE - ' + this.score
        this.plusScore.text = '+'+amount;
        this.tweens.add({
            targets: this.plusScore,
            alpha: 1,
            y: '-=100',
            duration: 500,
            yoyo: true,
            delay: 100,
            ease: 'quart.inout'
            
        })
    }

    addTime(amount){
        this.timeLeft += amount
        this.timerText.text = 'TIME LEFT - ' + this.timeLeft
        this.plusTimer.text = '+'+amount
        this.tweens.add({
            targets: this.plusTimer,
            alpha: 1,
            y: '-=100',
            duration: 500,
            yoyo: true,
            delay: 100,
            ease: 'quart.inout'
        })
    }

    pickWord(currWord){
        if (this.data.includes(currWord) && currWord[0] == this.word[this.word.length-1] && currWord.length > 1){
            this.tweens.add({
                targets: this.winText,
                alpha: 1,
                duration: 500,
                yoyo: true,
                delay: 100
            })

            this.addScore(currWord.length)
            this.addTime(Math.floor(currWord.length / 2))
            const result = this.data.filter((w) => w[0] == currWord[currWord.length-1])
            this.word = result[Phaser.Math.Between(0, result.length)]
            this.enemyText.text = this.word
            this.textEntry.text = ''
        }
        else
        {
            console.log(currWord)
        }
    }

}