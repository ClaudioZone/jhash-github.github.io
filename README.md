# corona.tum.lol

Diese Schnittstelle ergänzt die aktuellen Daten der Johns Hopkins University (https://coronavirus.jhu.edu/) mit einer ungefähren Abschätzung der Dunkelziffern.

## Berechnung der Dunkelziffern
Auch wenn die Einschätzung der tatsächlichen Lage aufgrund der hohen Infektionsrate extrem schwierig ist, gibt es einige Ansätze, z.B. mit einer Kombination aus der geschätzen exponentiellen Verbreitungsrate, der Inkubationszeit und den bestätigten Todeszahlen (https://medium.com/@tomaspueyo/coronavirus-act-today-or-people-will-die-f4d3d9cd99ca).

## Beispielkarte

Auf http://jhash-github.github.io/ gibt es eine Beispielanwendung in Form einer Weltkarte, die die aktuellen Daten in Kombination mit den Dunkelziffern darstellt.

## Request

* **PATH**

  **corona.tum.lol** (_http/https_)

* **Method**

  `GET`

* **Sample Call:**

  ```
  $.ajax({
        dataType: "json",
        url: "https://corona.tum.lol",
        success: function(data){
              ...
            }
        }
    });
  ```
* **Possible Response**

  ```
  {
    ...
    "features": [
      {
        "attributes": {
          "OBJECTID": 59,
          "Country_Region": "China",
          "Last_Update": 1584097775000,
          "Lat": 30.5928,
          "Long_": 114.3055,
          "Confirmed": 81305,
          "Deaths": 3259,
          "Recovered": 71857,
          "Active": 6189,
          "Estimated": 1503017
        }
      },
      {
        "attributes": {
          "OBJECTID": 131,
          "Country_Region": "Italy",
          "Last_Update": 1584812583000,
          "Lat": 41.8719,
          "Long_": 12.5674,
          "Confirmed": 53578,
          "Deaths": 4825,
          "Recovered": 6072,
          "Active": 42681,
          "Estimated": 2225240
        }
      },
      ...
  }
  ```

### WirVsVirus
Die API entstand im Rahmen des WirVsVirus Hackathon 2020 (https://wirvsvirushackathon.org/).
