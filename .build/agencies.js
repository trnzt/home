const fs = require("fs");
const path = require("path");
const countries = require("i18n-iso-countries");
const [_node, _script, mobilityDatabaseCatalogsPath] = process.argv;
const gtfsCatalogPath = path.resolve(
  mobilityDatabaseCatalogsPath,
  "catalogs",
  "sources",
  "gtfs",
  "schedule"
);

const agenciesByCountry = {};
for (const catalogItemFilename of fs.readdirSync(gtfsCatalogPath)) {
  const catalogItemPath = path.resolve(gtfsCatalogPath, catalogItemFilename);
  const catalogItem = JSON.parse(fs.readFileSync(catalogItemPath));
  const {
    status = "active",
    location: { country_code },
  } = catalogItem;
  if (status !== "active") continue;

  const agenciesByCountryEntry = agenciesByCountry[country_code] || {
    code: country_code,
    name: countries.getName(country_code, "en"),
    agency_count: 0,
  };
  agenciesByCountryEntry.agency_count += 1; // HACK! Need to read GTFS agencies.txt
  agenciesByCountry[country_code] = agenciesByCountryEntry;
}

const dataPath = path.resolve("_data");
{
  const values = Object.values(agenciesByCountry);
  values.sort(({ name: a }, { name: b }) => a.localeCompare(b));
  const agenciesByCountryPath = path.resolve(
    dataPath,
    "agencies_by_country.json"
  );
  fs.writeFileSync(agenciesByCountryPath, JSON.stringify(values));
}
