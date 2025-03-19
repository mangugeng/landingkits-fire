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
    const updatedComponent = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [property]: value
      }
    };
    console.log('Updating component:', updatedComponent); // Debug log
    onUpdate(updatedComponent);
  };

  const handleContentChange = (value: string) => {
    const updatedComponent = {
      ...selectedComponent,
      content: value
    };
    console.log('Updating content:', updatedComponent); // Debug log
    onUpdate(updatedComponent);
  };

  const inputClassName = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation min-h-[48px]";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-2";
  const selectClassName = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation min-h-[48px] appearance-none bg-white";

  const renderProperties = () => {
    switch (selectedComponent.type) {
      case 'heading':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelClassName}>
                Text
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => handleContentChange(e.target.value)}
                className={inputClassName}
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Alignment
              </label>
              <div className="relative">
                <select
                  value={selectedComponent.props?.alignment || 'left'}
                  onChange={(e) => handlePropertyChange('alignment', e.target.value)}
                  className={selectClassName}
                  style={{ fontSize: '16px' }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelClassName}>
                Text
              </label>
              <textarea
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                rows={4}
                className={inputClassName}
                style={{ fontSize: '16px', minHeight: '120px', resize: 'vertical' }}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Alignment
              </label>
              <div className="relative">
                <select
                  value={selectedComponent.props?.alignment || 'left'}
                  onChange={(e) => handlePropertyChange('alignment', e.target.value)}
                  className={selectClassName}
                  style={{ fontSize: '16px' }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelClassName}>
                Image URL
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                className={inputClassName}
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Alt Text
              </label>
              <input
                type="text"
                value={selectedComponent.props?.imageAlt || ''}
                onChange={(e) => handlePropertyChange('imageAlt', e.target.value)}
                className={inputClassName}
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-6">
            <div>
              <label className={labelClassName}>
                Text
              </label>
              <input
                type="text"
                value={selectedComponent.content}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  content: e.target.value
                })}
                className={inputClassName}
                style={{ fontSize: '16px' }}
              />
            </div>
            <div>
              <label className={labelClassName}>
                Variant
              </label>
              <div className="relative">
                <select
                  value={selectedComponent.props?.variant || 'primary'}
                  onChange={(e) => handlePropertyChange('variant', e.target.value)}
                  className={selectClassName}
                  style={{ fontSize: '16px' }}
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div>
            <label className={labelClassName}>
              Height (px)
            </label>
            <input
              type="number"
              value={selectedComponent.props?.height || 40}
              onChange={(e) => handlePropertyChange('height', parseInt(e.target.value))}
              className={inputClassName}
              style={{ fontSize: '16px' }}
              min="0"
              max="500"
              step="10"
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
          className="text-red-600 hover:text-red-700 p-2 rounded-lg touch-manipulation"
        >
          Delete
        </button>
      </div>
      {renderProperties()}
    </div>
  );
} 