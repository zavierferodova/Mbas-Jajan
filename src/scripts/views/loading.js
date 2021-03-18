import animation from '../../json/9844-loading-40-paperplane.json'

class Loading {
  async render () {
    return `
      <div class="animation-container" 
        style="display: flex;
          width: 100vw;
          height: 100vh;
          align-items: center;
          justify-content: center;">
        <div id="loading-animation"></div>
      </div>`
  }

  async afterRender () {
    const lottie = await import(/* webpackPrefetch: true */ 'lottie-web').then((module) => module.default)
    lottie.loadAnimation({
      container: document.querySelector('#loading-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation
    })
  }
}

export default Loading
