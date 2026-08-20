import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const user = await prisma.user.create({
    data: {
      fullName: 'Dexter',
      username: 'dexter',
      email: 'dexter@gmail.com',
      title: 'Designer',
      avatar: '',
      isGuest: false,
    },
  });

  console.log('Created user:', user.fullName);

  // Create projects
  const project1 = await prisma.project.create({
    data: { name: 'Design Homepage', priority: 'HIGH', ownerId: user.id },
  });

  const project2 = await prisma.project.create({
    data: { name: 'Develop Login Feature', priority: 'LOW', ownerId: user.id },
  });

  const project3 = await prisma.project.create({
    data: { name: 'Test Payment Gateway', priority: 'MEDIUM', ownerId: user.id },
  });

  console.log('Created 3 projects');

  // Create TODO tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Homepage',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales micro features effectively.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      labels: ['Research', 'Design', 'Development', 'Testing', 'Deployment'],
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Develop Login Feature',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date('2026-09-15'),
      labels: [],
      projectId: project1.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Test Payment Gateway',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-18'),
      labels: [],
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  // Create IN_PROGRESS tasks
  await prisma.task.create({
    data: {
      title: 'Design Homepage',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Develop Login Feature',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: new Date('2026-09-15'),
      projectId: project1.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Test Payment Gateway',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-18'),
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  // Create COMPLETED tasks
  await prisma.task.create({
    data: {
      title: 'Design Homepage',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Develop Login Feature',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: new Date('2026-09-15'),
      projectId: project1.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Test Payment Gateway',
      status: 'COMPLETED',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-18'),
      projectId: project1.id,
      assigneeId: user.id,
      reporterId: user.id,
    },
  });

  // Create subtasks for first task
  await prisma.task.create({
    data: {
      title: 'Subtask 1',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      projectId: project1.id,
      assigneeId: user.id,
      parentId: task1.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Subtask 2',
      status: 'IN_PROGRESS',
      priority: 'LOW',
      dueDate: new Date('2026-09-15'),
      projectId: project1.id,
      parentId: task1.id,
      reporterId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Subtask 3',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-18'),
      projectId: project1.id,
      assigneeId: user.id,
      parentId: task1.id,
      reporterId: user.id,
    },
  });

  // Add comments to first task
  await prisma.comment.create({
    data: {
      content: 'Ankit Dutta just Now - dsds',
      taskId: task1.id,
      authorId: user.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Leave a reply...',
      taskId: task1.id,
      authorId: user.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
