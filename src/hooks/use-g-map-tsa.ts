import store from '/@/store'
import { getRoot } from '/@/root'
import { ELocalStorageKey, EDeviceTypeName } from '/@/types'
import { getDeviceBySn } from '/@/api/manage'
import { message } from 'ant-design-vue'
import dockIcon from '/@/assets/icons/dock.png'
import rcIcon from '/@/assets/icons/rc.png'
import droneIcon from '/@/assets/icons/drone.png'
import { wgs84togcj02 } from '/@/vendors/coordtransform'

export function deviceTsaUpdate () {
  const root = getRoot()
  let AMap = root.$aMap

  const icons = new Map([
    [EDeviceTypeName.Aircraft, droneIcon],
    [EDeviceTypeName.Gateway, rcIcon],
    [EDeviceTypeName.Dock, dockIcon]
  ])
  const markers = store.state.markerInfo.coverMap
  const paths = store.state.markerInfo.pathMap

  let trackLine = null as any

  function getTrackLineInstance () {
    if (!trackLine) {
      trackLine = new AMap.Polyline({
        map: root.$map,
        strokeColor: '#939393' // 线颜色
      })
    }
    return trackLine
  }

  function initIcon (type: number) {
    return new AMap.Icon({
      image: icons.get(type),
      imageSize: new AMap.Size(40, 40),
      size: new AMap.Size(40, 40)
    })
  }

  /**
   * 添加坐标点
   * 更新调用在: GMap.vue
   * <pre>
   *  watch store.state.deviceState 中
   * </pre>
   * @param type
   * @param name
   * @param sn
   * @param lng
   * @param lat
   */
  function initMarker (type: number, name: string, sn: string, lng?: number, lat?: number) {
    // console.log('type', type, 'name', name, 'sn', sn)
    if (markers[sn]) {
      return
    }
    if (root.$aMap === undefined) {
      return
    }
    // 113.441315694, 23.162604328 为测绘院的坐标
    const longitudeTemp = lng ?? 113.441315694
    const latitudeTemp = lat ?? 23.162604328

    // 转换成高德坐标秕
    const coords = wgs84togcj02(longitudeTemp, latitudeTemp)

    AMap = root.$aMap
    markers[sn] = new AMap.Marker({
      // position: new AMap.LngLat(lng || 113.943225499, lat || 22.577673716),
      position: new AMap.LngLat(coords[0], coords[1]),
      icon: initIcon(type),
      title: name,
      anchor: 'top-center',
      offset: [0, -20],
    })
    root.$map.add(markers[sn])
    // markers[sn].on('moving', function (e: any) {
    //   let path = paths[sn]
    //   if (!path) {
    //     paths[sn] = e.passedPath
    //     return
    //   }
    //   path.push(e.passedPath[0])
    //   path.push(e.passedPath[1])
    //   getTrackLineInstance().setPath(path)
    // })
  }

  function removeMarker (sn: string) {
    if (!markers[sn]) {
      return
    }
    root.$map.remove(markers[sn])
    getTrackLineInstance().setPath([])
    delete markers[sn]
    delete paths[sn]
  }

  function addPolyline (sn: string, locations: []) {
    if (locations.length <= 0) {
      return
    }
    AMap = root.$aMap

    const path = []
    for (const pos of locations) {
      // console.log('pos', pos.lng, pos.lat, typeof (pos.lng))
      const gc = wgs84togcj02(pos.lng, pos.lat)
      path.push(new AMap.LngLat(gc[0], gc[1]))
    }
    // console.log('path', path)
    // 创建折线实例
    paths[sn] = new AMap.Polyline({
      path: path,
      borderWeight: 2, // 线条宽度，默认为 1
      strokeColor: 'green', // 线条颜色
      lineJoin: 'round' // 折线拐点连接处样式
    })
    root.$map.add(paths[sn])
  }

  function removePolyline (sn: string) {
    if (!paths[sn]) {
      return
    }
    root.$map.remove(paths[sn])
    getTrackLineInstance().setPath([])
    delete paths[sn]
  }

  function addMarker (sn: string, lng?: number, lat?: number) {
    getDeviceBySn(localStorage.getItem(ELocalStorageKey.WorkspaceId)!, sn)
      .then(data => {
        if (data.code !== 0) {
          message.error(data.message)
          return
        }
        initMarker(data.data.domain, data.data.nickname, sn, lng, lat)
      })
  }

  function moveTo (sn: string, lng: number, lat: number) {
    let marker = markers[sn]
    if (!marker) {
      addMarker(sn, lng, lat)
      marker = markers[sn]
      return
    }
    marker.moveTo([lng, lat], {
      duration: 1800,
      autoRotation: true
    })
  }

  return {
    marker: markers,
    initMarker,
    addPolyline,
    removePolyline,
    removeMarker,
    moveTo
  }
}
