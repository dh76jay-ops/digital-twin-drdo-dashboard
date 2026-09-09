import { useState } from "react";
import {
  Menu,
  X,
  MapPin,
  ArrowRight,
  Train,
  Bus,
  Landmark,
  Search,
  Clock,
  IndianRupee,
  Navigation,
} from "lucide-react";
import "./index.css";

const places = [
  {
    name: "Mahakaleshwar Temple",
    category: "Heritage",
    location: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80",
    description:
      "One of Ujjain's most important heritage and pilgrimage destinations.",
    time: "3:00 AM – 11:00 PM",
    fee: "Free entry",
  },
  {
    name: "Vikram Kirti Mandir",
    category: "Museum",
    location: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=900&q=80",
    description:
      "A cultural centre featuring archaeological and historical collections.",
    time: "10:30 AM – 5:30 PM",
    fee: "Check at venue",
  },
  {
    name: "Ram Ghat",
    category: "Heritage",
    location: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1609947017136-9daf32a1b6c1?auto=format&fit=crop&w=900&q=80",
    description:
      "A historic riverside ghat on the banks of the Shipra.",
    time: "Open daily",
    fee: "Free",
  },
  {
    name: "Kal Bhairav Temple",
    category: "Heritage",
    location: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    description:
      "A distinctive historic temple dedicated to Kal Bhairav.",
    time: "Morning – evening",
    fee: "Free entry",
  },
  {
    name: "Nature Escape",
    category: "Nature",
    location: "Near Ujjain",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    description:
      "A calm outdoor destination for visitors looking for a nature break.",
    time: "Daytime",
    fee: "Varies",
  },
  {
    name: "Local Museum",
    category: "Museum",
    location: "Ujjain",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80",
    description:
      "Explore local art, archaeology and cultural exhibits.",
    time: "10:00 AM – 5:00 PM",
    fee: "Check at venue",
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [route, setRoute] = useState(null);

  const filteredPlaces =
    filter === "All"
      ? places
      : places.filter((place) => place.category === filter);

  const goTo = (id) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const findRoute = () => {
    setRoute({
      mode: "Bus / Local",
      time: "Approx. 20–30 min",
      note: "Smart route suggestions will be connected to live map data.",
    });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <button className="logo" onClick={() => goTo("home")}>
          ✦ CITYSCAPE
        </button>

        <div className={`navLinks ${menuOpen ? "show" : ""}`}>
          <button onClick={() => goTo("explore")}>Explore</button>
          <button onClick={() => goTo("heritage")}>Heritage</button>
          <button onClick={() => goTo("journey")}>Plan Journey</button>
          <button onClick={() => goTo("about")}>About</button>
        </div>

        <button
          className="navButton"
          onClick={() => goTo("explore")}
        >
          Explore Map <ArrowRight size={16} />
        </button>

        <button
          className="menuButton"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">

        <div className="heroContent">

          <p className="eyebrow">
            <MapPin size={15} />
            SMART TOURISM • HERITAGE • MOBILITY
          </p>

          <h1>
            Discover your city,
            <br />
            <em>differently.</em>
          </h1>

          <p className="heroText">
            Explore places, understand their stories, and find the
            easiest way to reach them — all in one smart tourist guide.
          </p>

          <div className="heroActions">

            <button
              className="primaryButton"
              onClick={() => goTo("explore")}
            >
              Explore the Map
              <ArrowRight size={18} />
            </button>

            <button
              className="textButton"
              onClick={() => goTo("heritage")}
            >
              Discover Heritage
            </button>

          </div>
        </div>

        {/* MAP PREVIEW */}
        <div className="mapPreview">

          <div className="mapTop">
            <span>Ujjain Explorer</span>
            <span>● LIVE</span>
          </div>

          <div className="mapLines">

            <span className="route r1"></span>
            <span className="route r2"></span>
            <span className="route r3"></span>

            <button
              className="pin p1"
              onClick={() => setSelectedPlace(places[0])}
            >
              <MapPin size={22} />
            </button>

            <button
              className="pin p2"
              onClick={() => setSelectedPlace(places[1])}
            >
              <MapPin size={22} />
            </button>

            <button
              className="pin p3"
              onClick={() => setSelectedPlace(places[2])}
            >
              <MapPin size={22} />
            </button>

            <span className="mapLabel l1">Temple</span>
            <span className="mapLabel l2">Museum</span>
            <span className="mapLabel l3">Ghat</span>

          </div>

          <button
            className="mapBottom"
            onClick={() => goTo("explore")}
          >
            <Search size={16} />
            Search places on map
          </button>

        </div>
      </section>

      {/* EXPLORE */}
      <section className="section" id="explore">

        <div className="sectionHead">

          <div>
            <p className="eyebrow">EXPLORE</p>

            <h2>
              Places worth discovering.
            </h2>
          </div>

          <p className="sectionIntro">
            Curated tourist, heritage and cultural destinations
            with useful travel information.
          </p>

        </div>

        {/* FILTERS */}
        <div className="filters">

          {["All", "Heritage", "Museum", "Nature"].map((item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "filter active"
                  : "filter"
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}

        </div>

        {/* CARDS */}
        <div className="grid">

          {filteredPlaces.map((place) => (

            <button
              className="card"
              key={place.name}
              onClick={() => setSelectedPlace(place)}
            >

              <div className="cardImage">

                <img
                  src={place.image}
                  alt={place.name}
                />

                <span>{place.category}</span>

              </div>

              <div className="cardBody">

                <div>

                  <h3>{place.name}</h3>

                  <p>
                    <MapPin size={14} />
                    {place.location}
                  </p>

                </div>

                <span className="roundButton">
                  <ArrowRight size={17} />
                </span>

              </div>

            </button>

          ))}

        </div>
      </section>

      {/* HERITAGE */}
      <section className="heritageSection" id="heritage">

        <div className="heritageVisual">

          <Landmark
            size={42}
            strokeWidth={1.2}
          />

          <span>01 — HERITAGE</span>

        </div>

        <div className="heritageContent">

          <p className="eyebrow">
            DIGITAL HERITAGE
          </p>

          <h2>
            Every monument has a story.
          </h2>

          <p>
            Go beyond a location pin. Learn about history,
            architecture, artifacts, exhibits and cultural
            significance of every heritage site.
          </p>

          <button
            className="textButton"
            onClick={() => {
              setFilter("Heritage");
              goTo("explore");
            }}
          >
            Explore heritage →
          </button>

        </div>

      </section>

      {/* JOURNEY */}
      <section className="journey" id="journey">

        <div className="journeyHead">

          <p className="eyebrow">
            SMART ROUTE PLANNER
          </p>

          <h2>
            Plan your journey.
          </h2>

          <p>
            Compare practical ways to reach your destination.
          </p>

        </div>

        <div className="routeBox">

          <div className="routeInputs">

            <label>
              FROM

              <input
                defaultValue="Ujjain Railway Station"
              />
            </label>

            <ArrowRight className="routeArrow" />

            <label>
              TO

              <input
                defaultValue="Mahakaleshwar Temple"
              />
            </label>

            <button
              className="primaryButton"
              onClick={findRoute}
            >
              Find Route
              <ArrowRight size={17} />
            </button>

          </div>

          <div className="transportOptions">

            <button
              onClick={() =>
                setRoute({
                  mode: "Metro / Train",
                  time: "Fastest option",
                  note: "Live transit integration will be added soon.",
                })
              }
            >
              <Train size={20} />
              <span>Metro / Train</span>
              <small>Fastest</small>
            </button>

            <button
              onClick={() =>
                setRoute({
                  mode: "Bus / Local",
                  time: "Affordable option",
                  note: "Live local transport data will be added soon.",
                })
              }
            >
              <Bus size={20} />
              <span>Bus / Local</span>
              <small>Affordable</small>
            </button>

            <button
              onClick={() =>
                setRoute({
                  mode: "Walking",
                  time: "Best for nearby places",
                  note: "Walking route will be calculated using map routing.",
                })
              }
            >
              <MapPin size={20} />
              <span>Walking</span>
              <small>Nearby</small>
            </button>

          </div>

          {route && (

            <div className="routeResult">

              <Navigation size={20} />

              <div>
                <strong>{route.mode}</strong>
                <span>{route.time}</span>
                <small>{route.note}</small>
              </div>

            </div>

          )}

        </div>

      </section>

      {/* ABOUT */}
      <section
        className="footerCta"
        id="about"
      >

        <p className="eyebrow">
          ONE CITY. MANY STORIES.
        </p>

        <h2>
          Travel smarter.
          <br />
          <em>Experience deeper.</em>
        </h2>

        <p>
          A digital tourism platform connecting places,
          people, stories and mobility.
        </p>

      </section>

      {/* FOOTER */}
      <footer>
        <span>✦ CITYSCAPE</span>
        <span>Smart Tourism & Heritage Explorer</span>
        <span>© 2026</span>
      </footer>

      {/* PLACE DETAILS POPUP */}
      {selectedPlace && (

        <div
          className="modalOverlay"
          onClick={() => setSelectedPlace(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="closeModal"
              onClick={() => setSelectedPlace(null)}
            >
              <X />
            </button>

            <img
              src={selectedPlace.image}
              alt={selectedPlace.name}
            />

            <div className="modalContent">

              <span className="modalTag">
                {selectedPlace.category}
              </span>

              <h2>
                {selectedPlace.name}
              </h2>

              <p className="modalLocation">
                <MapPin size={15} />
                {selectedPlace.location}
              </p>

              <p>
                {selectedPlace.description}
              </p>

              <div className="infoRow">

                <span>
                  <Clock size={16} />
                  {selectedPlace.time}
                </span>

                <span>
                  <IndianRupee size={16} />
                  {selectedPlace.fee}
                </span>

              </div>

              <button
                className="primaryButton"
                onClick={() => {
                  setSelectedPlace(null);
                  goTo("journey");
                }}
              >
                How to reach
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;