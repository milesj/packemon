import { createContext, useContext } from 'react';
import type { StyleType } from '@boost/cli';

interface TreeContextType {
	folderStyle?: StyleType;
	lastIndex: [string, number];
}

export const TreeContext = createContext<TreeContextType | undefined>(undefined);

export function useTree() {
	return useContext(TreeContext);
}
