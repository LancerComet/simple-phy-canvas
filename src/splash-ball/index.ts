const canvas = document.querySelector('#app-canvas') as HTMLCanvasElement
const context = canvas.getContext('2d') as CanvasRenderingContext2D

window.addEventListener('resize', setCanvasSize)
setCanvasSize()

function setCanvasSize () {
  const width = document.body.clientWidth
  const height = document.body.clientHeight
  canvas.width = width
  canvas.height = height
}

class Ball {
  createAt: number = Date.now()

  readonly G: number   // px / s
  readonly resistance: number

  readonly initSpeedX: number  // px / s
  readonly initSpeedY: number  // px / s
  readonly initX: number
  readonly initY: number

  private bounceYCount: number = 1

  color: string
  size: number

  x: number
  y: number

  moveX () {
    const time = (Date.now() - this.createAt) / 1000
    const currentSpeed = this.initSpeedX
    this.x += currentSpeed
  }

  moveY () {
    const time = (Date.now() - this.createAt) / 1000
    const currentSpeed = this.initSpeedY - this.G * time
    this.y += currentSpeed * -1
  }

  reset () {
    this.x = this.initX
    this.y = this.initY
    this.createAt = Date.now()
  }

  bounceY () {
    this.createAt = Date.now() - this.resistance * this.bounceYCount
    this.bounceYCount++
  }

  canvas: HTMLCanvasElement = document.createElement('canvas')

  private createCanvas () {
    const canvas = this.canvas
    canvas.width = this.size
    canvas.height = this.size

    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.beginPath()
    context.arc(this.size / 2, this.size / 2, this.size / 2, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
    context.closePath()
  }

  constructor (param: IBallOption) {
    this.initSpeedX = param.speedX || 0
    this.initSpeedY = param.speedY || 0

    this.G = param.G || 40

    this.initX = param.x || 0
    this.initY = param.y || 0

    this.reset()

    this.color = param.color || '#ffffff'
    this.size = param.size || 10

    this.resistance = param.resistance || 100

    this.createCanvas()
  }
}

interface IBallOption {
  speedX?: number
  speedY?: number
  x?: number
  y?: number
  G?: number
  color?: string
  size?: number
  resistance?: number
}

const balls: Ball[] = []

createBall(1000)

function createBall (count: number) {
  let i = 0
  while (i < count) {
    balls.push(
      new Ball({
        // speedX: Math.random() * 32 * (Math.random() > .5 ? 1 : -1),
        // speedY: Math.random() * 50,
        // x: Math.random() * canvas.width,
        speedX: Math.random() * 40 * (Math.random() > .5 ? 1 : -1),
        speedY: Math.random() * 60,
        x: canvas.width / 2,
        y: canvas.height,
        size: Math.round(Math.random() * 20) || 10,
        color: getRandomColor()
      })
    )
    i++
  }
}

function tick () {
  context.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0, length = balls.length; i < length; i++) {
    const ball = balls[i]
    if (!ball) {
      continue
    }

    ball.moveX()
    ball.moveY()

    if (
      ball.x < 0 ||
      ball.x > canvas.width ||
      ball.y > canvas.height
    ) {
      ball.reset()
    }

    context.drawImage(ball.canvas, ball.x, ball.y)
  }
  requestAnimationFrame(tick)
}

function getRandomColor () {
  const colors = [
    '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#FFC107', '#FF5722'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
