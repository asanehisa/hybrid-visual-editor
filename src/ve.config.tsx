import { ComponentConfig, DefaultComponentProps, DropZone, type Config } from "@measured/puck";
import "@yext/visual-editor/style.css";
import "./index.css";
import {
  PageSectionCategory,
  PageSectionCategoryComponents,
  PageSectionCategoryProps,
  OtherCategoryComponents,
  OtherCategoryProps,
  DirectoryCategoryComponents,
  DirectoryCategoryProps,
  LocatorCategoryComponents,
  LocatorCategoryProps,
  useDocument,
} from "@yext/visual-editor";

interface MainProps
  extends PageSectionCategoryProps,
    OtherCategoryProps {}

const components: Config<MainProps>["components"] = {
  ...PageSectionCategoryComponents,
  ...OtherCategoryComponents,
};

// All the available components for locations
export const mainConfig: Config<MainProps> = {
  components,
  categories: {
    pageSections: {
      title: "Page Sections",
      components: PageSectionCategory,
    },
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

interface DirectoryConfigProps
  extends DirectoryCategoryProps,
    OtherCategoryProps {}

export const directoryConfig: Config<DirectoryConfigProps> = {
  components: {
    ...DirectoryCategoryComponents,
    ...OtherCategoryComponents,
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

interface LocatorConfigProps
  extends LocatorCategoryProps,
    OtherCategoryProps {}

export const locatorConfig: Config<LocatorConfigProps> = {
  components: {
    ...LocatorCategoryComponents,
    ...OtherCategoryComponents,
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  },
};

interface MockProps {
  envVar?: string;
}

const MockHello  = (props: MockProps) => {
  const document = useDocument<any>();
  return (
  <>Hello world {props.envVar && document?._env?.[props?.envVar]}</>
)}

const Mock: ComponentConfig<MockProps> = 
{
  label: "Mock",    
  render: (props) => (
    <MockHello {...props} />
  ),
}

interface RepoProps {
  Mock: MockProps;
}

type ComponentPropOverrides = {
  Mock: Pick<MockProps, "envVar">;
};

export function withPropOverrides<K extends keyof ComponentPropOverrides>(
  base: ComponentConfig<any>,
  overrides: ComponentPropOverrides[K]
): ComponentConfig<any> {
  return {
    ...base,
    render: (props) => base.render({ ...props, ...overrides }),
  };
}

export const repoConfig: Config<RepoProps> = {
  components: {
    Mock: withPropOverrides(Mock, {envVar: "YEXT_PUBLIC_TEST"})
  },
  root: {
    render: () => {
      return (
        <DropZone
          zone="default-zone"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        />
      );
    },
  }
}

export const componentRegistry = new Map<string, Config<any>>([
  ["main", mainConfig],
  ["directory", directoryConfig],
  ["locator", locatorConfig],
  ["repo", repoConfig],
]);
