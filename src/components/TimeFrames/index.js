import React from 'react'
// @ts-ignore
import { map } from 'lodash/fp'
import { Tabs, TabLink, TabList, Tab } from 'bloomer'
import { TIME_FRAMES } from 'appConstants'

export default ({ onChange, activeTf, className = '' }) => (
  <Tabs isAlign="centered" isSize="small" className="is-fullwidth">
    <TabList>
      {map(
        ({ name, id, longName }) => (
          <Tab key={id} isActive={id === activeTf}>
            <TabLink onClick={() => onChange(id)}>{name}</TabLink>
          </Tab>
        ),
        TIME_FRAMES
      )}
    </TabList>
  </Tabs>
)
