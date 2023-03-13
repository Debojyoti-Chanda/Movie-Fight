const createAutocomplete = ({root,renderOptions,onOptionSelect,inputValue,fetchData})=>{
    // const root = document.querySelector(".autocomplete");
root.innerHTML =`
<lable><b>Search</b></lable>
<input class="input"></input>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;

const dropdown = root.querySelector(".dropdown");
const resultsRapper = root.querySelector(".results");
const input = root.querySelector("input");

const onInput = async (event)=>{
    const items  = await fetchData(event.target.value);
    if(!items.length){
        dropdown.classList.remove("is-active");
        return;
    };
    // console.log(items);
    resultsRapper.innerHTML="";
    dropdown.classList.add("is-active");
    for(let item of items){
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = renderOptions(item)
        option.addEventListener("click",(event)=>{
            dropdown.classList.remove("is-active");
            input.value = inputValue(item);
            onOptionSelect(item);
        })
        // document.querySelector("#target").appendChild(div);
        resultsRapper.appendChild(option);
    }
};

input.addEventListener("input",debounce(onInput,2000));
document.addEventListener("click", (event)=>{
    if(!root.contains(event.target)){
        dropdown.classList.remove("is-active");
    }
});
};