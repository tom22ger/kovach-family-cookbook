import { useEffect, useRef, useState } from "react";

import Banner from "./assets/kfc-banner.svg";
import SearchIcon from "./assets/search.svg";
import ArrowBackIcon from "./assets/arrow-back.svg";

import RECIPES from "./recipes.json";

import "./App.css";

function App() {
  const scrollRef = useRef();
  const [filterValue, setFilterValue] = useState("all");
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showRecipe, setShowRecipe] = useState(null);

  const recipes = RECIPES;
  const filteredRecipes = filterRecipes(recipes, filterValue);

  return (
    <div className="App">
      <div className="Main">
        <HeaderBar />
        <RecipeList setShowRecipe={setShowRecipe} recipes={filteredRecipes} scrollRef={scrollRef} />
        <SearchBar
          setShowSearchDialog={setShowSearchDialog}
          onChange={(value) => {
            setFilterValue(value);
            scrollRef.current.scrollTo(0, 0);
          }}
          filterValue={filterValue}
        />
      </div>
      {showSearchDialog && (
        <SearchDialog
          closeDialog={() => setShowSearchDialog(false)}
          recipes={recipes}
          setShowRecipe={setShowRecipe}
        />
      )}
      <RecipeDialog
        closeDialog={() => setShowRecipe(null)}
        recipe={showRecipe !== null ? recipes[showRecipe] : null}
      />
    </div>
  );
}

export default App;

function filterRecipes(recipes, filter) {
  if (filter === "all") {
    return recipes;
  }
  return recipes.filter(({ category }) => {
    return filter.includes(category);
  });
}

function SearchBar({ setShowSearchDialog, filterValue, onChange }) {
  return (
    <div className="SearchBar">
      <FilterSelect onChange={onChange} value={filterValue} />
      <SearchButton setShowSearchDialog={setShowSearchDialog} />
    </div>
  );
}

function SearchButton({ setShowSearchDialog }) {
  return (
    <button
      className="SearchButton"
      onClick={() => {
        setShowSearchDialog(true);
      }}>
      <img src={SearchIcon} alt="search" />
    </button>
  );
}

const filterOptions = [
  { label: "All Recipes", value: "all" },
  { label: "Soups", value: "soup" },
  { label: "Dips and Sauces", value: "dip sauce" },
  { label: "Saland and Vegetables", value: "salad vegetable" },
  { label: "Breads", value: "bread" },
  { label: "Desserts", value: "dessert" },
];

function FilterSelect({ value, onChange }) {
  return (
    <>
      <span className="select-arrow">▼</span>
      <select
        name="categories"
        id="filter"
        className="FilterSelect"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}>
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}

function RecipeList({ recipes, setShowRecipe, scrollRef }) {
  return (
    <div className="RecipeList" ref={scrollRef}>
      {recipes.map((recipe, index) => (
        <RecipeCard
          key={index}
          recipe={recipe}
          onClick={() => {
            setShowRecipe(index);
          }}
        />
      ))}
    </div>
  );
}

function HeaderBar() {
  return (
    <header className="HeaderBar">
      <img src={Banner} alt="Kovach Family Cookbook" />
    </header>
  );
}

function RecipeCard({ recipe, onClick }) {
  const { name, source, category } = recipe;
  return (
    <div className="RecipeCard" onClick={onClick}>
      <div className="name">
        <h1>{name}</h1>
        <h4>{source}</h4>
      </div>
      {category && <div className="category">{toTitleCase(category)}</div>}
    </div>
  );
}

function SearchDialog({ recipes, setShowRecipe, closeDialog }) {
  const [search, setSearch] = useState("");
  const searchedRecipes = recipes.filter(({ name = "", source = "" }) => {
    const searchString = search.toLowerCase();
    return name.toLowerCase().includes(searchString) || source.toLowerCase().includes(searchString);
  });

  return (
    <div className="SearchDialog">
      <div className="page-header">
        <input
          autoFocus
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button onClick={closeDialog}>Cancel</button>
      </div>
      <RecipeList recipes={searchedRecipes} setShowRecipe={setShowRecipe} />
    </div>
  );
}

function RecipeDialog({ recipe: nullableRecipe, closeDialog }) {
  const recipe = nullableRecipe || {};
  const scrollRef = useRef();
  const { name, source, ingredients, directions } = recipe;
  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, [nullableRecipe]);
  return (
    <div className={`RecipeDialog ${nullableRecipe !== null ? "show" : ""}`}>
      <div className="page-header">
        <button onClick={closeDialog}>
          <img src={ArrowBackIcon} alt="<" />
          Back
        </button>
        <header>Recipe</header>
      </div>
      <div className="recipe" ref={scrollRef}>
        <h1>{name}</h1>
        <h4>{source}</h4>
        <ul>
          {(ingredients || []).map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <p>{directions}</p>
      </div>
    </div>
  );
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
