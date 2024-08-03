const fs = require('fs');

const filePath = 'response.txt';

for (let z = 0; z < 100; z++) {
    for (let j = 8; j < 11; j++) {
        let month = "";
        if (j < 10) {
            month = `0${j}`
        } else {
            month = `${j}`
        }
        for (let i = 1; i < 30; i++) {
            let day = "";
            if (i < 10) {
                day = `0${i}`
            } else {
                day = `${i}`
            }

            let body = {
                source: "ASN",
                destination: "NDLS",
                date: `2024${month}${day}`,
                travelClass: "3A"
            }

            fetch("http://localhost:3000/getAllDirectTrains", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            })
                .then((response) => response.json())
                .then((data) => {
                    fs.appendFile(filePath, JSON.stringify(data), 'utf8', (err) => {
                        if (err) {
                            console.error('Error appending data:', err);
                        } else {
                            console.log('Data appended successfully!');
                        }
                    });
                });

        }
    }
}