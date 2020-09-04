module.exports = {
  verbose: true,
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "babel-jest",
  },
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
};
