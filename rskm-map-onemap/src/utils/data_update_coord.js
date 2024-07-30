import config from "../../../config/mapServeConfig";
import { gcj02_To_gps84 } from "./transform";

const cross = () => {


    // 获取路口表
    //http://localhost:3000/v1/query/way_code_hainan_cross?columns=*&limit=100


    let datajson = [];
    fetch("http://localhost:3000/v1/query/way_code_hainan_cross?columns=*&limit=300")
        .then((response) => response.json())
        .then((json) => {
            if (json.length > 0) {
              //  console.log(json);
                datajson = json;


                let index = 0;
                let time = setInterval(() => {
                    getPOI(datajson[index], index);

                    index++;
                    if (index >= datajson.length) {
                        clearTimeout(time)
                        console.info("完成更新")
                    }
                }, (Math.random() + 0.5) * 100)
            }
        })
        .catch((err) => console.log("Request Failed", err));

    // 查询POI

    const getPOI = (d, id) => {
        fetch(config.API.getGaodePoi.replace("{keywords}", d.name).replace("{region}", "海南省"))
            .then((response) => response.json())
            .then((json) => {
                if (json.status == "1" && json.pois.length > 0) {
                   // console.log(json, json.pois);
                  
                    setCoord(json.pois[0]["location"].split(",")[0], json.pois[0]["location"].split(",")[1], json.pois[0]["name"], id)
                }

            })
            .catch((err) => console.log("Request Failed", err));
    }

    // 更新路口表
    const setCoord = (longitude, latitude, name, id) => {
        //http://localhost:3000/v1/update_coord?filter=%E6%96%B0%E5%9D%A1%E4%BA%92%E9%80%9A&longitude=22&latitude=22

        let ll = gcj02_To_gps84([
            Number(longitude),
            Number(latitude),
          ]);

        fetch(`http://localhost:3000/v1/update_coord?filter=${name}&longitude=${ll.lng}&latitude=${lat}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.length == 0) {
                    console.info(name + ": 更新完成,索引" + id);
                }

            })
            .catch((err) => console.log("Request Failed", err));
    }

}

export {
    cross
}