import UZIP from 'uzip'

const sharedDOMParser = new DOMParser()
const sharedTextDecoder = new TextDecoder()

function isSamePosition (p1, p2) {
  return p1.lat === p2.lat && p1.lng === p2.lng
}

function makeAction (id, position, ...action) {
  return {
    type: 'action',
    id,
    name: '',
    position,
    action
  }
}

/**
 * use unicode codepoint to display iconfont glyph, workaround Safari issues
 * for complete list of codepoint <-> glyph
 * @see https://github.com/jossef/material-design-icons-iconfont/blob/v6.1.0/src/_variables.scss
 */
const HomeMark = '\uE88A' // home

/**
 * prepend action 'home' to first point in path
 */
function prependHomeMark (path, actions) {
  if (actions.length > 0 && isSamePosition(actions[0].position, path[0])) {
    actions[0].action.unshift(HomeMark)
  } else {
    actions.unshift(makeAction('home', path[0], HomeMark))
  }
}

const KMZActions = {
  takePhoto: '\uE3B0', // camera_alt
  startRecord: '\uE04B', // videocam
  stopRecord: '\uE04C' // videocam_off
}

/**
 * parse KMZ file to path object
 * @param {ArrayBuffer} buf KMZ buffer
 * @returns
 */
export async function parseKMZ (buf) {
  console.log('buf', buf)
  const boundary = []
  const path = []
  const actions = []
  // load zip file
  const zip = UZIP.parse(buf)
  // read template
  const template = zip['wpmz/template.kml']
  const templateStr = sharedTextDecoder.decode(template)
  const kml = sharedDOMParser.parseFromString(templateStr, 'text/xml')
  const kmlFolder = kml.querySelector('Document>Folder')
  const templateType = kmlFolder.getElementsByTagName('wpml:templateType')[0].textContent
  if (templateType === 'mapping2d') {
    kmlFolder.querySelector('Placemark>Polygon coordinates')
      .textContent
      .replace(/[\n\t ]/g, '')
      .replace(/,0$/, '')
      .split(',0').forEach(lnglat => {
      const [lng, lat] = lnglat.split(',').map(Number.parseFloat)
      boundary.push({
        lng,
        lat
      })
    })
  }
  // read waypoint and actions
  const waylines = zip['wpmz/waylines.wpml']
  const waylineStr = sharedTextDecoder.decode(waylines)
  const xml = sharedDOMParser.parseFromString(waylineStr, 'text/xml')
  const placemarks = xml.querySelectorAll('Document>Folder>Placemark')
  const placemarkArray = Array.from(placemarks).sort((a, b) => {
    const [ia, ib] = [a, b].map(e => Number.parseInt(e.getElementsByTagName('wpml:index')[0].textContent, 10))
    return ia - ib
  })
  for (const pm of placemarkArray) {
    const [lng, lat] = pm.querySelector('Point>coordinates').textContent.split(',').map(Number.parseFloat)
    const position = {
      lng,
      lat
    }
    path.push(position)
    const actionGroup = pm.getElementsByTagName('wpml:actionGroup')[0]
    if (!actionGroup) continue
    const action = makeAction(`a${actions.length}`, position)
    for (const act of Array.from(actionGroup.getElementsByTagName('wpml:action'))) {
      const func = act.getElementsByTagName('wpml:actionActuatorFunc')[0].textContent
      const a = KMZActions[func]
      if (!a) continue
      if (!action.action.includes(a)) {
        action.action.push(a)
      }
    }
    if (action.action.length > 0) {
      actions.push(action)
    }
  }
  prependHomeMark(path, actions)
  return {
    boundary,
    path,
    actions
  }
}
