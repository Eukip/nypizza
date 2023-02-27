import React, {useState} from 'react'
import {CCard} from "@coreui/react"
// import {YMaps, Map, Polygon} from "react-yandex-maps";

const NYMap = () => {
  return (
    <CCard className='m-2'>
      {/*<YMaps query={{load: "package.full"}}>*/}
      {/*  <Map*/}
      {/*    height="99vh"*/}
      {/*    width="100%"*/}
      {/*    defaultState={{*/}
      {/*      center: [42.88, 74.58],*/}
      {/*      zoom: 10,*/}
      {/*      controls: ["typeSelector"],*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    {*/}
      {/*      feels && feels.map((zone, ind) => {*/}
      {/*        return <Polygon*/}
      {/*          modules={[*/}
      {/*            "geoObject.addon.balloon",*/}
      {/*            "geoObject.addon.hint",*/}
      {/*          ]}*/}
      {/*          key={zone.id}*/}
      {/*          geometry={[zone.fee.coors]}*/}
      {/*          options={{*/}
      {/*            fillColor: `${*/}
      {/*              zone.amount < 20*/}
      {/*                ? "#8ed38b"*/}
      {/*                : zone.amount < 40*/}
      {/*                  ? "#aad369"*/}
      {/*                  : zone.amount < 60*/}
      {/*                    ? "#71d326"*/}
      {/*                    : zone.amount < 80*/}
      {/*                      ? "#b2d300"*/}
      {/*                      : zone.amount < 100*/}
      {/*                        ? "#b2d300"*/}
      {/*                        : zone.amount < 140*/}
      {/*                          ? "#d39900"*/}
      {/*                          : zone.amount < 200*/}
      {/*                            ? "#d36200"*/}
      {/*                            : zone.amount < 220*/}
      {/*                              ? "#d32100"*/}
      {/*                              : zone.amount < 240*/}
      {/*                                ? "#d30000"*/}
      {/*                                : zone.amount < 260*/}
      {/*                                  ? "#7a0000"*/}
      {/*                                  : zone.amount < 280*/}
      {/*                                    ? "#3a0000"*/}
      {/*                                    : zone.amount < 300*/}
      {/*                                      ? "#4a1738"*/}
      {/*                                      : zone.amount < 350*/}
      {/*                                        ? "#210000"*/}
      {/*                                        : "#210b19"*/}
      {/*            }`,*/}
      {/*            strokeColor: "#004B35",*/}
      {/*            opacity: 0.7,*/}
      {/*            strokeWidth: 1,*/}
      {/*            strokeStyle: "shortdash",*/}
      {/*          }}*/}
      {/*          properties={{*/}
      {/*            hintContent:*/}
      {/*              "Название: " +*/}
      {/*              zone.name +*/}
      {/*              "</br>" +*/}
      {/*              "Доплата: " +*/}
      {/*              zone.amount,*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      })*/}
      {/*    }*/}
      {/*  </Map>*/}
      {/*</YMaps>*/}
    </CCard>
  );
};

export default NYMap;
