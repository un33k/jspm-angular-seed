System.config({
  "baseURL": "/",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.15",
    "angular-route": "github:angular/bower-angular-route@1.3.15",
    "angular-ui/ui-router": "github:angular-ui/ui-router@0.2.14",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87",
    "github:angular-ui/ui-router@0.2.14": {
      "angular": "github:angular/bower-angular@1.3.15"
    },
    "github:angular/bower-angular-route@1.3.15": {
      "angular": "github:angular/bower-angular@1.3.15"
    }
  }
});

