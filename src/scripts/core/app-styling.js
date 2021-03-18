class AppStyling {
  static appendStyle (css) {
    const styleRoot = document.querySelector('#style-root')
    const styleElement = document.createElement('style')
    styleElement.innerHTML = css
    styleRoot.appendChild(styleElement)
  }

  static updateStyle (css) {
    const styleRoot = document.querySelector('#style-root')
    const styleElement = document.createElement('style')
    const removeAllChild = () => {
      styleRoot.childNodes.forEach(element => {
        styleRoot.removeChild(element)
      })
    }
    removeAllChild()

    styleElement.innerHTML = css
    styleRoot.appendChild(styleElement)
  }
}

export default AppStyling
