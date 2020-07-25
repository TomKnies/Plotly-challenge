// pull in data

d3.json("./samples.json").then((bioData) => {
    var data = bioData;
    console.log(data);

    var samples = data.samples;
    console.log(samples);

// make dropdowns for subject IDs

    const ids = data.names;
    dropdown = d3.select("#selDataset");
    ids.forEach(id => {
        dropdown.append("option")
            .text(id);
    })

// make bar chart of top 10 OTUs of subject in dropdown

    function makePlots(id) {
        var sample = samples.filter(samples => samples.id === id)
        console.log(sample)

// get each unique top 10 from the data

        var sample_values = sample[0].sample_values;
        var otu_ids = sample[0].otu_ids;        
        var otu_labels = sample[0].otu_labels;

        var sample_values_top10 = sample_values.slice(0, 10).reverse();
        var otu_ids_top10 = otu_ids.slice(0, 10)
            .reverse()
            .map(String)
            .map(id => "OTU " + id);
        var otu_labels_top10 = otu_labels.slice(0, 10).reverse();

// display demographic info

        var metaData = data.metadata;
        var person = parseInt(id);
        console.log(person);
        var demoInfo = metaData.filter(data => data.id === person)
        var demo_dict = demoInfo[0];
        console.log(demoInfo);

        console.log(Object.entries(demo_dict));

        var info = d3.select("#sample-metadata")
        info.html("");
        info.append("ul");
        Object.entries(demo_dict).forEach(i => {
            info.append("li")
                .text(`${i[0]}: ${i[1]}`);
        });

// trace layout bar graph

        var trace1 = {
            type: "bar",
            orientation: "h",
            x: sample_values_top10,
            y: otu_ids_top10,
            text: otu_labels_top10
        };
        var layout = {
            title: "Top 10 OTUs",
        };
        data1 = [trace1];

        Plotly.newPlot("bar", data1, layout);

// trace layout for bubbles

        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };
        var layout2 = {
            title: "Top 10 OTUs",
            height: 500,
            width: 1200
        };
        data2 = [trace2];

        Plotly.newPlot('bubble', data2, layout2);
    }

// make graphs update with each change to dropdown selection

    function newID() {
        var dropDownMenu = d3.select("#selDataset");
        var dropDownValue = dropDownMenu.property("value");
        console.log(dropDownValue);

        makePlots(dropDownValue)
    }

    makePlots(samples[0].id);
    dropdown.on("change", newID);
})