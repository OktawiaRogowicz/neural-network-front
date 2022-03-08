
import {useListOfCategories, listOfCategoriesEn} from "../categoriesDetails";

const ResultsText = ({response, index}) => {
    const results = [];
    if(index != 0 && response != undefined) {
      for (let i = 0; i < 10; i++) {
        var parsed = parseFloat(response.results[i]);
        results.push(
          <p key={i}> <b>{useListOfCategories[i]}:</b> {isNaN(parsed) ? response.results[i] : parsed.toFixed(2) * 100.0}%</p>
        );
      }
    }

    return(<div>{results}</div>);
  }

export default ResultsText;