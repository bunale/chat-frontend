export function initViewportHeight() {
    const setAppHeight = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setAppHeight()
    window.addEventListener('resize', setAppHeight)
    window.addEventListener('orientationchange', setAppHeight)

    return () => {
        window.removeEventListener('resize', setAppHeight)
        window.removeEventListener('orientationchange', setAppHeight)
    }
}
