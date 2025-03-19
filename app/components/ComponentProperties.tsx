import { ComponentData } from './EditorComponents';

interface ComponentPropertiesProps {
  selectedComponent: ComponentData | null;
  onUpdate: (component: ComponentData) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export function ComponentProperties({ 
  selectedComponent, 
  onUpdate, 
  onDelete,
  isMobile = false 
}: ComponentPropertiesProps) {
  if (!selectedComponent) {
    return (
      <div className={`
        ${isMobile ? 'p-4' : 'p-6'} 
        text-center text-gray-500
      `}>
        Select a component to edit its properties
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    onUpdate({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [property]: value
      }
    });
  };

  const renderProperties = () => {
    switch (selectedComponent.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <select
                value={selectedComponent.props?.alignment || 'left'}
                onChange={(e) => handlePropertyChange('alignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <textarea
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alignment
              </label>
              <select
                value={selectedComponent.props?.alignment || 'left'}
                onChange={(e) => handlePropertyChange('alignment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={selectedComponent.props?.imageAlt || ''}
                onChange={(e) => handlePropertyChange('imageAlt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant
              </label>
              <select
                value={selectedComponent.props?.variant || 'primary'}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              value={selectedComponent.props?.height || 40}
              onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Properties
        </h3>
        <button
          onClick={() => onDelete(selectedComponent.id)}
          className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {renderProperties()}
    </div>
  );
} 