const express = require("express");

const server = express();
server.listen(3000);
server.use(express.json());

const projects = [];
let countRequest = 0;

server.use((req, res, next) => {
  countRequest++;
  console.log(`There ${countRequest} request so far!`)

  return next();
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id: id,
    title: title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/taks", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(projects);
})

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projet = projects.find(p => p.id == id);
  projet.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);
  return res.send();
});

function checkProject(req, res, next) {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) {
    return res.status(400).json({ error: "Project doesn't exists !" })
  }
  return next();
}