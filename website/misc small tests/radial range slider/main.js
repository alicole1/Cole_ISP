const button = document.querySelector('.button')
const outerCircle = document.querySelector('.outer-circle')
const percent = document.querySelector('.percent')

let lastAngle = 0

const setAngle = unNormalizedAngle => {
    // -90 + 360 => 270
    const angle = unNormalizedAngle < 0 ? unNormalizedAngle + 360 : unNormalizedAngle

    if (Math.abs(angle - lastAngle) > 180) {
        return
    }

    const anglePercent = Math.round(angle / 360 * 100)

    button.style.transform = `rotateZ(${angle}deg)`
    outerCircle.style.background = `conic-gradient(gold ${anglePercent}%, #666 0)`

    percent.innerText = `${anglePercent}%`
    lastAngle = angle
}

const handler = (event) => {
    const rect = outerCircle.getBoundingClientRect()

    const x = event.clientX - (rect.left + rect.width / 2)
    const y = event.clientY - (rect.top + rect.height / 2)

    const angle = Math.atan2(y, x) * 180 / Math.PI

    setAngle((angle + 90))
}

button.addEventListener('mousedown', () => {
    window.addEventListener('mousemove', handler)
})
window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', handler)
})