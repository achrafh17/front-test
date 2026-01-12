import React, { useEffect, useState } from "react";
import { IDeviceSingle } from "../../types/api.types";
import Map from "ol/Map";
import * as layer from "ol/layer";
import * as source from "ol/source";
import * as geom from "ol/geom";
import * as proj from "ol/proj";
import * as style from "ol/style";
import Overlay from "ol/Overlay";
import View from "ol/View";
import Feature from "ol/Feature";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { MapBrowserEvent } from "ol";

interface props {
  deviceInfo: IDeviceSingle;
}

const MAP_MARKER_ICON_URL =
  "https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=fa-circle-solid&size=35&hoffset=0.5&voffset=-1";

const DeviceMapView: React.FC<props> = ({ deviceInfo }) => {
  const [mapObj, setMapObj] = useState<Map | null>(null);
  const [coordinates, setCoordinates] = useState<
    { lat: number; lon: number; name: string }[]
  >([]);

  const areCoordsValid = (c: string) => {
    if (!c.includes(",")) return false;
    var parts = c.split(",");
    if (parts.length !== 2) {
      return false;
    }
    var [lat, lon] = parts;
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      return false;
    }
    return true;
  };

  const getMarkerFeatureFromLonLat = (
    lon: number,
    lat: number,
    name: string
  ) => {
    var iconFeature = new Feature({
      geometry: new geom.Point(
        proj.transform([lon, lat], "EPSG:4326", "EPSG:3857")
      ),
    });
    iconFeature.set("name", name);
    var iconStyle = new style.Style({
      image: new style.Icon({
        anchor: [0.5, 1],
        src: MAP_MARKER_ICON_URL,
      }),
    });
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  };

  useEffect(() => {
    if (deviceInfo.isGroup) {
      var validCoords: { lat: number; lon: number; name: string }[] = [];
      deviceInfo.children.forEach((device) => {
        if (device.location && areCoordsValid(device.location)) {
          validCoords.push({
            lat: parseFloat(device.location.split(",")[0]),
            lon: parseFloat(device.location.split(",")[1]),
            name: device.name,
          });
        } else {
          return undefined;
        }
      });
      setCoordinates(validCoords);
    } else {
      if (deviceInfo.location && areCoordsValid(deviceInfo.location)) {
        setCoordinates([
          {
            lat: parseFloat(deviceInfo.location.split(",")[0]),
            lon: parseFloat(deviceInfo.location.split(",")[1]),
            name: deviceInfo.name,
          },
        ]);
      }
    }
  }, [deviceInfo]);

  useEffect(() => {
    var tooltip = document.getElementById("tooltip")!;
    var overlay = new Overlay({
      element: tooltip,
      offset: [10, 0],
      positioning: "bottom-left",
    });

    const overlayListener = (evt: MapBrowserEvent<any>) => {
      if (mapObj) {
        var pixel = evt.pixel;
        var feature = mapObj.forEachFeatureAtPixel(pixel, function (f) {
          return f;
        });
        var tooltip = document.getElementById("tooltip");
        if (tooltip) {
          tooltip.style.display = feature ? "" : "none";
          if (feature) {
            mapObj.getTargetElement().style.cursor = "pointer";
            overlay.setPosition(evt.coordinate);
            tooltip.innerHTML = feature.get("name");
          } else {
            mapObj.getTargetElement().style.cursor = "";
          }
        }
      }
    };
    if (mapObj !== null) {
      if (coordinates.length) {
        var features: Feature<geom.Point>[] = coordinates.map((c) => {
          return getMarkerFeatureFromLonLat(c.lon, c.lat, c.name);
        });
        var vectorSource = new source.Vector({
          features: features,
        });

        var vectorLayer = new layer.Vector({
          source: vectorSource,
        });

        mapObj.addLayer(vectorLayer);
        mapObj.addOverlay(overlay);
        mapObj.on("pointermove", overlayListener);
      }
    }

    return () => {
      if (mapObj) {
        mapObj.un("pointermove", overlayListener);
      }
    };
  }, [mapObj, coordinates]);

  useEffect(() => {
    setTimeout(() => {
      var mapEl = document.querySelector("#map");
      if (mapEl) {
        mapEl.innerHTML = "<div id='tooltip' class='tooltip'></div>";
      }
      var centerLon = 0,
        centerLat = 0;
      if (coordinates.length) {
        centerLat = coordinates[0].lat;
        centerLon = coordinates[0].lon;
      }
      setMapObj(
        new Map({
          target: "map",
          layers: [
            new TileLayer({
              source: new XYZ({
                url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              }),
            }),
          ],
          view: new View({
            center: proj.fromLonLat([centerLon, centerLat]),
            zoom: 7,
          }),
        })
      );
      //300ms is the length of the animation
    }, 300);
  }, [coordinates]);

  return (
    <div id="map" style={{ width: "100%", height: 380 }}>
      <div id="tooltip" className="tooltip"></div>
    </div>
  );
};

export default DeviceMapView;
