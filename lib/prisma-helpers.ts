import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

// Safe utility functions for accessing Prisma models
// with proper type definitions to avoid TypeScript errors

export const tagsApi = {
  findMany: (args?: Prisma.TagFindManyArgs) => 
    prisma.$transaction(async (tx) => {
      return await tx.tag.findMany(args);
    }),
  
  findFirst: (args: Prisma.TagFindFirstArgs) => 
    prisma.$transaction(async (tx) => {
      return await tx.tag.findFirst(args);
    }),
  
  create: (args: Prisma.TagCreateArgs) => 
    prisma.$transaction(async (tx) => {
      return await tx.tag.create(args);
    }),
    
  update: (args: Prisma.TagUpdateArgs) => 
    prisma.$transaction(async (tx) => {
      return await tx.tag.update(args);
    }),
    
  delete: (args: Prisma.TagDeleteArgs) => 
    prisma.$transaction(async (tx) => {
      return await tx.tag.delete(args);
    })
};
