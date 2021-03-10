describe('Arcgis Tests', () => {
    it('Geometry Filter after Draw Rectangle and Add Markers', () => {
      cy.visit("https://demossl.netcad.com.tr/mapapi/lib/test_base.html").then((win) => {
        const { NCMapAPI } = win;
        const mappromise = cy.wrap(NCMapAPI.NCMap.init('map', 'arcgis', { }));
  
        mappromise.then(
          (map) => {
            map.addBaseLayer({ mapid: 'BingUyduGörüntüsü', underlayerid: 'r' });
            map.setView({ zoom: 13, center: [28.7, 41] });
  
            const netgisspserver = new NCMapAPI.NetgisServer({
              user: 'netadmin',
              password: '1',
              netgisurl: 'https://snetigma.netcad.com.tr/Netgissvn',
            });
  
            const routingwspromise = cy.wrap(netgisspserver.getWorkspace('BELNETMAP6BDZ'), { timeout: 200000 });
            let wsfilter;
            const netgisadded2 = routingwspromise.then((ws) => {
              map.addWorkspace(ws,
                { setview: false });
              wsfilter = ws;
            });
            
            netgisadded2.then(() => {
              map.draw({ geometry: 'rectangle', clearafter: true }).then(
                (rectangle) => {
               
                wsfilter.geometryFilter(rectangle, 'geomahalle').then((res) => {
                  expect(res).not.to.be.null;
                  map.addFeatures(res, {
                    zoomto: true,
                    markerurl: "https://img.icons8.com/offices/2x/marker.png",
                    showpopup: true,
                    cluster: true
                  }).then(markerlayer => {
                    console.log(markerlayer);
                    expect(markerlayer).not.to.be.null;
                   
                  });
  
                  });
                },
              );
          
              cy.get('canvas').click( 250, 250); 
            
              cy.get('canvas').click( 500, 500); 
  
             
             
            });
          },
        );
      });
    });
  });
  